const express = require('express');
const router = express.Router();

// Mock drug database
const drugDatabase = [
  {
    id: 'drug-001',
    name: 'Paracetamol',
    genericName: 'Acetaminofén',
    brandNames: ['Tylenol', 'Apiretal', 'Gelocatil'],
    category: 'Analgésico',
    form: 'Comprimido',
    strength: '500mg',
    indications: ['Dolor leve a moderado', 'Fiebre'],
    contraindications: ['Insuficiencia hepática severa'],
    dosage: {
      adult: '500-1000mg cada 6-8 horas (máximo 4g/día)',
      pediatric: '10-15mg/kg cada 6-8 horas'
    },
    interactions: ['Warfarina', 'Alcohol']
  },
  {
    id: 'drug-002',
    name: 'Ibuprofeno',
    genericName: 'Ibuprofeno',
    brandNames: ['Advil', 'Nurofen', 'Espidifen'],
    category: 'AINE',
    form: 'Comprimido',
    strength: '400mg',
    indications: ['Dolor', 'Inflamación', 'Fiebre'],
    contraindications: ['Úlcera péptica activa', 'Insuficiencia renal severa'],
    dosage: {
      adult: '400-600mg cada 8 horas (máximo 2.4g/día)',
      pediatric: '5-10mg/kg cada 8 horas'
    },
    interactions: ['Warfarina', 'ACE inhibidores', 'Diuréticos']
  },
  {
    id: 'drug-003',
    name: 'Amoxicilina',
    genericName: 'Amoxicilina',
    brandNames: ['Amoxil', 'Clamoxyl'],
    category: 'Antibiótico',
    form: 'Cápsula',
    strength: '500mg',
    indications: ['Infecciones bacterianas'],
    contraindications: ['Alergia a penicilinas'],
    dosage: {
      adult: '500mg cada 8 horas',
      pediatric: '25-50mg/kg/día dividido en 3 dosis'
    },
    interactions: ['Anticoagulantes orales']
  }
];

// Drug interactions database
const interactions = [
  {
    drug1: 'Warfarina',
    drug2: 'Paracetamol',
    severity: 'moderate',
    description: 'El paracetamol puede potenciar el efecto anticoagulante de la warfarina.'
  },
  {
    drug1: 'Warfarina',
    drug2: 'Ibuprofeno',
    severity: 'high',
    description: 'Aumenta significativamente el riesgo de hemorragia.'
  },
  {
    drug1: 'ACE inhibidores',
    drug2: 'Ibuprofeno',
    severity: 'moderate',
    description: 'Puede reducir la eficacia de los ACE inhibidores y aumentar el riesgo de daño renal.'
  }
];

// Search drugs
router.get('/search', (req, res) => {
  const { q, category } = req.query;
  
  let results = drugDatabase;
  
  if (q) {
    const searchTerm = q.toLowerCase();
    results = results.filter(drug => 
      drug.name.toLowerCase().includes(searchTerm) ||
      drug.genericName.toLowerCase().includes(searchTerm) ||
      drug.brandNames.some(brand => brand.toLowerCase().includes(searchTerm))
    );
  }
  
  if (category) {
    results = results.filter(drug => 
      drug.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  res.json(results);
});

// Get drug by ID
router.get('/drugs/:id', (req, res) => {
  const drug = drugDatabase.find(d => d.id === req.params.id);
  
  if (!drug) {
    return res.status(404).json({ error: 'Medicamento no encontrado' });
  }
  
  res.json(drug);
});

// Check drug interactions
router.post('/interactions', (req, res) => {
  const { drugs } = req.body;
  
  if (!drugs || !Array.isArray(drugs) || drugs.length < 2) {
    return res.status(400).json({ error: 'Se requieren al menos 2 medicamentos' });
  }
  
  const foundInteractions = [];
  
  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const drug1 = drugs[i].toLowerCase();
      const drug2 = drugs[j].toLowerCase();
      
      const interaction = interactions.find(int => 
        (int.drug1.toLowerCase() === drug1 && int.drug2.toLowerCase() === drug2) ||
        (int.drug1.toLowerCase() === drug2 && int.drug2.toLowerCase() === drug1)
      );
      
      if (interaction) {
        foundInteractions.push({
          ...interaction,
          drugs: [drugs[i], drugs[j]]
        });
      }
    }
  }
  
  res.json({
    interactions: foundInteractions,
    hasInteractions: foundInteractions.length > 0,
    riskLevel: foundInteractions.some(int => int.severity === 'high') ? 'high' : 
               foundInteractions.some(int => int.severity === 'moderate') ? 'moderate' : 'low'
  });
});

// Generate electronic prescription
router.post('/prescriptions', (req, res) => {
  const { patientId, drugs, physicianId } = req.body;
  
  // TODO: Implement proper prescription generation with digital signature
  const prescription = {
    id: `RX-${Date.now()}`,
    patientId,
    physicianId,
    drugs,
    date: new Date().toISOString(),
    status: 'active',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };
  
  res.json({
    success: true,
    prescription,
    message: 'Receta electrónica generada exitosamente'
  });
});

// Get drug categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(drugDatabase.map(drug => drug.category))];
  res.json(categories);
});

module.exports = router;