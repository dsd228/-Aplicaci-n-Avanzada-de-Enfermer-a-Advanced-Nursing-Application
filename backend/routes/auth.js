const express = require('express');
const router = express.Router();

// Authentication routes
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // TODO: Implement proper authentication with bcryptjs and JWT
    // For now, return a mock response
    
    if (email === 'demo@clinipro.com' && password === 'demo123') {
      const token = 'mock-jwt-token'; // TODO: Generate real JWT
      res.json({
        success: true,
        token,
        user: {
          id: '1',
          name: 'Dr. Juan Pérez',
          email: 'demo@clinipro.com',
          role: 'doctor',
          specialty: 'Cardiología'
        }
      });
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, specialty } = req.body;
    
    // TODO: Implement user registration with proper validation
    res.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/logout', (req, res) => {
  // TODO: Implement token blacklisting
  res.json({ success: true, message: 'Sesión cerrada exitosamente' });
});

router.get('/profile', (req, res) => {
  // TODO: Implement JWT verification middleware
  res.json({
    id: '1',
    name: 'Dr. Juan Pérez',
    email: 'demo@clinipro.com',
    role: 'doctor',
    specialty: 'Cardiología'
  });
});

module.exports = router;