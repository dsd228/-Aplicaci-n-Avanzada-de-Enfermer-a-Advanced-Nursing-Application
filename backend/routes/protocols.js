const express = require('express');
const router = express.Router();

// Medical protocols organized by specialty
const protocols = {
  urgencias: [
    {
      id: 'urg-001',
      title: 'Protocolo de Manejo de la Crisis Hipertensiva',
      description: 'Algoritmo diagnóstico y terapéutico para el manejo de urgencias hipertensivas en sala de emergencias.',
      specialty: 'Urgencias',
      pages: 12,
      format: 'PDF',
      lastUpdate: '2023-12-01',
      downloadUrl: '/api/protocols/download/urg-001',
      content: {
        objectives: ['Diagnóstico rápido', 'Tratamiento inmediato', 'Prevención de complicaciones'],
        steps: [
          'Evaluación inicial del paciente',
          'Medición de presión arterial',
          'Evaluación de daño a órganos diana',
          'Selección del tratamiento antihipertensivo',
          'Monitoreo continuo'
        ]
      }
    },
    {
      id: 'urg-002',
      title: 'Protocolo de RCP Avanzado',
      description: 'Guía completa para reanimación cardiopulmonar en adultos según las últimas directrices.',
      specialty: 'Urgencias',
      pages: 18,
      format: 'PDF',
      lastUpdate: '2023-11-15',
      downloadUrl: '/api/protocols/download/urg-002'
    }
  ],
  cardiologia: [
    {
      id: 'card-001',
      title: 'Protocolo de Síndrome Coronario Agudo',
      description: 'Manejo integral del paciente con síndrome coronario agudo desde el ingreso hasta el alta.',
      specialty: 'Cardiología',
      pages: 24,
      format: 'PDF',
      lastUpdate: '2023-12-05',
      downloadUrl: '/api/protocols/download/card-001'
    }
  ],
  infectologia: [
    {
      id: 'inf-001',
      title: 'Protocolo de Antibioticoterapia Empírica',
      description: 'Guía de selección de antibióticos según localización de infección y perfil de resistencias local.',
      specialty: 'Infectología',
      pages: 24,
      format: 'PDF',
      lastUpdate: '2023-11-20',
      downloadUrl: '/api/protocols/download/inf-001'
    }
  ]
};

// Get all protocols by specialty
router.get('/', (req, res) => {
  const { specialty } = req.query;
  
  if (specialty) {
    const specialtyProtocols = protocols[specialty.toLowerCase()] || [];
    res.json(specialtyProtocols);
  } else {
    res.json(protocols);
  }
});

// Get protocol by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Search across all specialties
  for (const specialty of Object.values(protocols)) {
    const protocol = specialty.find(p => p.id === id);
    if (protocol) {
      return res.json(protocol);
    }
  }
  
  res.status(404).json({ error: 'Protocolo no encontrado' });
});

// Download protocol
router.get('/download/:id', (req, res) => {
  const { id } = req.params;
  
  // TODO: Implement actual file download
  res.json({ 
    message: 'Descarga iniciada',
    downloadId: id,
    note: 'Esta funcionalidad será implementada con archivos PDF reales'
  });
});

// Search protocols
router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  const searchTerm = query.toLowerCase();
  
  const results = [];
  
  for (const [specialtyName, specialtyProtocols] of Object.entries(protocols)) {
    for (const protocol of specialtyProtocols) {
      if (
        protocol.title.toLowerCase().includes(searchTerm) ||
        protocol.description.toLowerCase().includes(searchTerm) ||
        protocol.specialty.toLowerCase().includes(searchTerm)
      ) {
        results.push(protocol);
      }
    }
  }
  
  res.json(results);
});

// Get specialties
router.get('/meta/specialties', (req, res) => {
  const specialties = Object.keys(protocols).map(key => ({
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: protocols[key].length
  }));
  
  res.json(specialties);
});

module.exports = router;