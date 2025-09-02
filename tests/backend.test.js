# CliniPro Suite Backend Unit Tests
const request = require('supertest');
const app = require('../backend/server');

describe('CliniPro Suite API', () => {
  describe('Health Check', () => {
    test('GET /api/health should return healthy status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body.service).toBe('CliniPro Suite API');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Protocols API', () => {
    test('GET /api/protocols should return all protocols', async () => {
      const response = await request(app)
        .get('/api/protocols')
        .expect(200);
      
      expect(response.body).toHaveProperty('urgencias');
      expect(response.body).toHaveProperty('cardiologia');
      expect(response.body).toHaveProperty('infectologia');
    });

    test('GET /api/protocols?specialty=urgencias should return urgency protocols', async () => {
      const response = await request(app)
        .get('/api/protocols?specialty=urgencias')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('specialty', 'Urgencias');
    });

    test('GET /api/protocols/urg-001 should return specific protocol', async () => {
      const response = await request(app)
        .get('/api/protocols/urg-001')
        .expect(200);
      
      expect(response.body.id).toBe('urg-001');
      expect(response.body.title).toBeDefined();
      expect(response.body.specialty).toBe('Urgencias');
    });

    test('GET /api/protocols/nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/api/protocols/nonexistent')
        .expect(404);
      
      expect(response.body.error).toBe('Protocolo no encontrado');
    });

    test('GET /api/protocols/search/hipertension should return search results', async () => {
      const response = await request(app)
        .get('/api/protocols/search/hipertension')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('title');
      }
    });

    test('GET /api/protocols/meta/specialties should return specialty list', async () => {
      const response = await request(app)
        .get('/api/protocols/meta/specialties')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('count');
    });
  });

  describe('Pharmacy API', () => {
    test('GET /api/pharmacy/search should return all drugs when no query', async () => {
      const response = await request(app)
        .get('/api/pharmacy/search')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('GET /api/pharmacy/search?q=paracetamol should return paracetamol', async () => {
      const response = await request(app)
        .get('/api/pharmacy/search?q=paracetamol')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name.toLowerCase()).toContain('paracetamol');
    });

    test('GET /api/pharmacy/drugs/drug-001 should return specific drug', async () => {
      const response = await request(app)
        .get('/api/pharmacy/drugs/drug-001')
        .expect(200);
      
      expect(response.body.id).toBe('drug-001');
      expect(response.body.name).toBeDefined();
      expect(response.body.category).toBeDefined();
    });

    test('POST /api/pharmacy/interactions should check drug interactions', async () => {
      const response = await request(app)
        .post('/api/pharmacy/interactions')
        .send({ drugs: ['Warfarina', 'Paracetamol'] })
        .expect(200);
      
      expect(response.body).toHaveProperty('interactions');
      expect(response.body).toHaveProperty('hasInteractions');
      expect(response.body).toHaveProperty('riskLevel');
    });

    test('POST /api/pharmacy/interactions should require at least 2 drugs', async () => {
      const response = await request(app)
        .post('/api/pharmacy/interactions')
        .send({ drugs: ['Warfarina'] })
        .expect(400);
      
      expect(response.body.error).toBe('Se requieren al menos 2 medicamentos');
    });

    test('GET /api/pharmacy/categories should return drug categories', async () => {
      const response = await request(app)
        .get('/api/pharmacy/categories')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Patients API', () => {
    test('GET /api/patients should return patients list', async () => {
      const response = await request(app)
        .get('/api/patients')
        .expect(200);
      
      expect(response.body).toHaveProperty('patients');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.patients)).toBe(true);
    });

    test('GET /api/patients/P-001 should return specific patient', async () => {
      const response = await request(app)
        .get('/api/patients/P-001')
        .expect(200);
      
      expect(response.body.id).toBe('P-001');
      expect(response.body.name).toBeDefined();
      expect(response.body.age).toBeDefined();
    });

    test('POST /api/patients should create new patient', async () => {
      const newPatient = {
        name: 'Test Patient',
        age: 45,
        gender: 'masculino',
        phone: '+34 600 000 000',
        email: 'test@example.com',
        condition: 'Test condition',
        allergies: 'None'
      };

      const response = await request(app)
        .post('/api/patients')
        .send(newPatient)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.patient).toHaveProperty('id');
      expect(response.body.patient.name).toBe(newPatient.name);
    });

    test('GET /api/patients/stats/overview should return patient statistics', async () => {
      const response = await request(app)
        .get('/api/patients/stats/overview')
        .expect(200);
      
      expect(response.body).toHaveProperty('totalPatients');
      expect(response.body).toHaveProperty('averageAge');
      expect(response.body).toHaveProperty('genderDistribution');
      expect(response.body).toHaveProperty('commonConditions');
    });
  });

  describe('Authentication API', () => {
    test('POST /api/auth/login with valid credentials should return token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'demo@clinipro.com', password: 'demo123' })
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('role');
    });

    test('POST /api/auth/login with invalid credentials should return 401', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@email.com', password: 'wrongpass' })
        .expect(401);
      
      expect(response.body.error).toBe('Credenciales inválidas');
    });

    test('GET /api/auth/profile should return user profile', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(200);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('role');
    });
  });
});