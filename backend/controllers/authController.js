const express = require('express');
const router = express.Router();

// Define your routes here
router.post('/register', (req, res) => {
  res.send('User registered');
});

module.exports = router; // Ensure you're exporting the router correctly
