const express = require('express');
const cors = require('cors');
const database = require('./database');
const scraper = require('./scraper');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'https://<your-github-username>.github.io/<your-repo-name>', // Replace with your GitHub Pages URL
}));
app.use(cors());
app.use(express.json());

// Database initialization
database.init();

// API endpoints
app.get('/patients', async (req, res) => {
  const patients = await database.getPatients();
  res.json(patients);
});

app.post('/patients', async (req, res) => {
  const patient = req.body;
  await database.addPatient(patient);
  res.status(201).json(patient);
});

app.get('/vitals/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  const vitals = await database.getVitals(patientId);
  res.json(vitals);
});

app.post('/vitals', async (req, res) => {
  const vital = req.body;
  await database.addVital(vital);
  res.status(201).json(vital);
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
