const express = require('express');
const router = express.Router();

// Appointments routes
router.get('/', (req, res) => {
  res.json({ message: 'Appointments endpoint - To be implemented' });
});

module.exports = router;