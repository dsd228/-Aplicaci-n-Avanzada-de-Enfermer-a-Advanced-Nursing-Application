const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const database = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;

// Role-based permissions
const ROLES = {
  ADMIN: 'admin',
  MEDICO: 'medico',
  ENFERMERO: 'enfermero',
  NUTRICIONISTA: 'nutricionista',
  FISIOTERAPEUTA: 'fisioterapeuta',
  PSIQUIATRA: 'psiquiatra'
};

const PERMISSIONS = {
  [ROLES.ADMIN]: ['all'],
  [ROLES.MEDICO]: ['patients:read', 'patients:write', 'medical_records:read', 'medical_records:write', 'vitals:read', 'vitals:write', 'meds:read', 'meds:write', 'notes:read', 'notes:write'],
  [ROLES.ENFERMERO]: ['patients:read', 'vitals:read', 'vitals:write', 'meds:read', 'meds:write', 'notes:read', 'notes:write', 'tasks:read', 'tasks:write'],
  [ROLES.NUTRICIONISTA]: ['patients:read', 'vitals:read', 'notes:read', 'notes:write'],
  [ROLES.FISIOTERAPEUTA]: ['patients:read', 'vitals:read', 'notes:read', 'notes:write', 'tasks:read', 'tasks:write'],
  [ROLES.PSIQUIATRA]: ['patients:read', 'medical_records:read', 'medical_records:write', 'notes:read', 'notes:write']
};

// Hash password
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Generate 2FA secret
function generate2FASecret(email) {
  return speakeasy.generateSecret({
    name: `SaludPro (${email})`,
    issuer: 'SaludPro'
  });
}

// Verify 2FA token
function verify2FAToken(secret, token) {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });
}

// Check if user has permission
function hasPermission(userRole, permission) {
  const userPermissions = PERMISSIONS[userRole] || [];
  return userPermissions.includes('all') || userPermissions.includes(permission);
}

// Middleware to authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
}

// Middleware to check permissions
function requirePermission(permission) {
  return (req, res, next) => {
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Audit logging middleware
function auditLogger(action, resourceType) {
  return async (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      // Log successful operations
      if (res.statusCode < 400) {
        const logEntry = {
          id: require('crypto').randomUUID(),
          user_id: req.user?.id || 'anonymous',
          action,
          resource_type: resourceType,
          resource_id: req.params.id || req.params.patientId || null,
          details: JSON.stringify({ 
            method: req.method, 
            url: req.url, 
            body: req.body 
          }),
          ip_address: req.ip || req.connection.remoteAddress
        };
        database.createAuditLog(logEntry).catch(console.error);
      }
      originalSend.call(this, data);
    };
    next();
  };
}

module.exports = {
  ROLES,
  PERMISSIONS,
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  generate2FASecret,
  verify2FAToken,
  hasPermission,
  authenticateToken,
  requirePermission,
  auditLogger
};