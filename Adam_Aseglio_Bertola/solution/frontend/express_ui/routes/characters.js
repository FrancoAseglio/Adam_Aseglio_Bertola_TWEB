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

router.get('/:id', async (req, res) => {
  try {
    const characterResponse = await axios.get(`${GATEWAY_URL}/characters/${req.params.id}`);
    
    res.render('character-detail', {
      layout: false,
      title: `Character ${req.params.id}`,
      character: characterResponse.data
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Character not found',
      error: { status: 404, stack: error.messile.readage }
    });
  }
});

module.exports = router;
