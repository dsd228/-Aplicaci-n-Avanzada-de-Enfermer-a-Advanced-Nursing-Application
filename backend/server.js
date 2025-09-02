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

// Medications endpoints
app.get('/meds/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  const meds = await database.getMeds(patientId);
  res.json(meds);
});

app.post('/meds', async (req, res) => {
  const med = req.body;
  await database.addMed(med);
  res.status(201).json(med);
});

// Notes endpoints
app.get('/notes/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  const notes = await database.getNotes(patientId);
  res.json(notes);
});

app.post('/notes', async (req, res) => {
  const note = req.body;
  await database.addNote(note);
  res.status(201).json(note);
});

// Fluids endpoints
app.get('/fluids/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  const fluids = await database.getFluids(patientId);
  res.json(fluids);
});

app.post('/fluids', async (req, res) => {
  const fluid = req.body;
  await database.addFluid(fluid);
  res.status(201).json(fluid);
});

// Tasks endpoints
app.get('/tasks/:patientId', async (req, res) => {
  const patientId = req.params.patientId;
  const tasks = await database.getTasks(patientId);
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const task = req.body;
  await database.addTask(task);
  res.status(201).json(task);
});

app.put('/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { done } = req.body;
  await database.updateTask(taskId, done);
  res.json({ success: true });
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
