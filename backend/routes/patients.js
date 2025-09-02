const express = require('express');
const router = express.Router();

// Mock patients database
let patients = [
  {
    id: 'P-001',
    name: 'María González',
    age: 68,
    gender: 'femenino',
    phone: '+34 612 345 678',
    email: 'maria.lopez@email.com',
    condition: 'Diabetes tipo 2, Hipertensión',
    allergies: 'Penicilina',
    createdAt: '2023-12-01T10:00:00.000Z',
    lastVisit: '2023-12-15T14:30:00.000Z'
  },
  {
    id: 'P-002',
    name: 'Carlos Ruiz Martínez',
    age: 72,
    gender: 'masculino',
    phone: '+34 623 456 789',
    email: 'carlos.ruiz@email.com',
    condition: 'Insuficiencia cardíaca, FA',
    allergies: 'Ibuprofeno',
    createdAt: '2023-11-28T09:15:00.000Z',
    lastVisit: '2023-12-14T11:00:00.000Z'
  },
  {
    id: 'P-003',
    name: 'Ana Sánchez Gómez',
    age: 55,
    gender: 'femenino',
    phone: '+34 634 567 890',
    email: 'ana.sanchez@email.com',
    condition: 'Artritis reumatoide',
    allergies: null,
    createdAt: '2023-12-02T16:20:00.000Z',
    lastVisit: '2023-12-13T10:45:00.000Z'
  }
];

// Get all patients
router.get('/', (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  
  let filteredPatients = patients;
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredPatients = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.id.toLowerCase().includes(searchTerm) ||
      patient.condition.toLowerCase().includes(searchTerm)
    );
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);
  
  res.json({
    patients: paginatedPatients,
    total: filteredPatients.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredPatients.length / limit)
  });
});

// Get patient by ID
router.get('/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  
  res.json(patient);
});

// Create new patient
router.post('/', (req, res) => {
  const { name, age, gender, phone, email, condition, allergies } = req.body;
  
  // Generate new patient ID
  const patientCount = patients.length + 1;
  const newId = `P-${patientCount.toString().padStart(3, '0')}`;
  
  const newPatient = {
    id: newId,
    name,
    age: parseInt(age),
    gender,
    phone,
    email,
    condition,
    allergies,
    createdAt: new Date().toISOString(),
    lastVisit: null
  };
  
  patients.push(newPatient);
  
  res.status(201).json({
    success: true,
    patient: newPatient,
    message: 'Paciente creado exitosamente'
  });
});

// Update patient
router.put('/:id', (req, res) => {
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  
  const updatedPatient = {
    ...patients[patientIndex],
    ...req.body,
    lastVisit: new Date().toISOString()
  };
  
  patients[patientIndex] = updatedPatient;
  
  res.json({
    success: true,
    patient: updatedPatient,
    message: 'Paciente actualizado exitosamente'
  });
});

// Delete patient
router.delete('/:id', (req, res) => {
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Paciente no encontrado' });
  }
  
  patients.splice(patientIndex, 1);
  
  res.json({
    success: true,
    message: 'Paciente eliminado exitosamente'
  });
});

// Get patient statistics
router.get('/stats/overview', (req, res) => {
  const totalPatients = patients.length;
  const avgAge = patients.reduce((sum, p) => sum + p.age, 0) / totalPatients;
  const genderDistribution = patients.reduce((acc, p) => {
    acc[p.gender] = (acc[p.gender] || 0) + 1;
    return acc;
  }, {});
  
  const commonConditions = patients.reduce((acc, p) => {
    const conditions = p.condition.split(',').map(c => c.trim());
    conditions.forEach(condition => {
      acc[condition] = (acc[condition] || 0) + 1;
    });
    return acc;
  }, {});
  
  res.json({
    totalPatients,
    averageAge: Math.round(avgAge),
    genderDistribution,
    commonConditions: Object.entries(commonConditions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([condition, count]) => ({ condition, count }))
  });
});

module.exports = router;