const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const database = require('./database');
const scraper = require('./scraper');
const auth = require('./auth');

const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// More restrictive rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

app.use(express.json({ limit: '10mb' }));

// Database initialization
database.init();

// Authentication endpoints
app.post('/auth/register', authLimiter, async (req, res) => {
  try {
    const { email, password, name, role, specialty, license_number, phone } = req.body;
    
    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await database.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await auth.hashPassword(password);
    
    // Create user
    const user = {
      id: require('crypto').randomUUID(),
      email,
      password: hashedPassword,
      name,
      role,
      specialty: specialty || null,
      license_number: license_number || null,
      phone: phone || null
    };
    
    await database.createUser(user);
    
    // Remove password from response
    delete user.password;
    
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password, twoFactorToken } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Get user
    const user = await database.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await auth.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check 2FA if enabled
    if (user.two_factor_enabled) {
      if (!twoFactorToken) {
        return res.status(200).json({ requiresTwoFactor: true });
      }
      
      const isValid2FA = auth.verify2FAToken(user.two_factor_secret, twoFactorToken);
      if (!isValid2FA) {
        return res.status(401).json({ error: 'Invalid 2FA token' });
      }
    }
    
    // Generate JWT token
    const token = auth.generateToken(user);
    
    // Log successful login
    await database.createAuditLog({
      id: require('crypto').randomUUID(),
      user_id: user.id,
      action: 'login',
      resource_type: 'user',
      resource_id: user.id,
      details: JSON.stringify({ email }),
      ip_address: req.ip || req.connection.remoteAddress
    });
    
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        specialty: user.specialty
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/setup-2fa', auth.authenticateToken, async (req, res) => {
  try {
    const secret = auth.generate2FASecret(req.user.email);
    
    // Save secret to user record (temporarily, until confirmed)
    await database.updateUser(req.user.id, { 
      two_factor_secret: secret.base32 
    });
    
    res.json({
      secret: secret.base32,
      qrCode: secret.otpauth_url
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/confirm-2fa', auth.authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await database.getUserById(req.user.id);
    const isValid = auth.verify2FAToken(user.two_factor_secret, token);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid 2FA token' });
    }
    
    // Enable 2FA for user
    await database.updateUser(req.user.id, { 
      two_factor_enabled: 1 
    });
    
    res.json({ message: '2FA enabled successfully' });
  } catch (error) {
    console.error('2FA confirmation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected API endpoints
app.get('/users', auth.authenticateToken, auth.requirePermission('users:read'), async (req, res) => {
  try {
    const { role } = req.query;
    const users = await database.getAllUsers(role);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Enhanced patient endpoints
app.get('/patients', auth.authenticateToken, auth.requirePermission('patients:read'), auth.auditLogger('read', 'patients'), async (req, res) => {
  try {
    const patients = await database.getPatients();
    res.json(patients);
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/patients', auth.authenticateToken, auth.requirePermission('patients:write'), auth.auditLogger('create', 'patients'), async (req, res) => {
  try {
    const patient = {
      ...req.body,
      id: req.body.id || 'P-' + Date.now().toString().slice(-6)
    };
    await database.addPatient(patient);
    res.status(201).json(patient);
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/vitals/:patientId', auth.authenticateToken, auth.requirePermission('vitals:read'), auth.auditLogger('read', 'vitals'), async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const vitals = await database.getVitals(patientId);
    res.json(vitals);
  } catch (error) {
    console.error('Get vitals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/vitals', auth.authenticateToken, auth.requirePermission('vitals:write'), auth.auditLogger('create', 'vitals'), async (req, res) => {
  try {
    const vital = {
      ...req.body,
      recorded_by: req.user.id
    };
    await database.addVital(vital);
    res.status(201).json(vital);
  } catch (error) {
    console.error('Create vital error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Medical Records endpoints
app.get('/medical-records/:patientId', auth.authenticateToken, auth.requirePermission('medical_records:read'), auth.auditLogger('read', 'medical_records'), async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const records = await database.getMedicalRecords(patientId);
    res.json(records);
  } catch (error) {
    console.error('Get medical records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/medical-records', auth.authenticateToken, auth.requirePermission('medical_records:write'), auth.auditLogger('create', 'medical_records'), async (req, res) => {
  try {
    const record = {
      ...req.body,
      id: require('crypto').randomUUID(),
      created_by: req.user.id
    };
    await database.createMedicalRecord(record);
    res.status(201).json(record);
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notifications endpoints
app.get('/notifications', auth.authenticateToken, async (req, res) => {
  try {
    const { unread } = req.query;
    const notifications = await database.getUserNotifications(req.user.id, unread === 'true');
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/notifications', auth.authenticateToken, async (req, res) => {
  try {
    const notification = {
      ...req.body,
      id: require('crypto').randomUUID(),
      user_id: req.user.id
    };
    await database.createNotification(notification);
    res.status(201).json(notification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// School (Scraping) endpoint
app.get('/school', async (req, res) => {
  const { query, type } = req.query;
  try {
    const results = await scraper.search(query, type);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
