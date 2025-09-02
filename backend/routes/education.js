const express = require('express');
const router = express.Router();

// Education routes
router.get('/courses', (req, res) => {
  res.json({ message: 'Education courses endpoint - To be implemented' });
});

module.exports = router;