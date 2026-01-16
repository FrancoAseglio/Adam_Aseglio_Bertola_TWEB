const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gateway URL
const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/search', async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.json({ error: 'Please provide a character name' });
  }

  try {
    const response = await axios.get(`${GATEWAY_URL}/characters/search`, { params: { name } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error searching characters',
      message: error.message 
    });
  }
});

module.exports = router;
