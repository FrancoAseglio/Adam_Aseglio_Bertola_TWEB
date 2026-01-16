const express = require('express');
const router = express.Router();
const axios = require('axios');
const BACKEND_SPRING_URL = 'http://localhost:8080/api';

router.get('/search', async (req, res) => {
  try {
    const name = req.query.name || '';
    const response = await axios.get(`${BACKEND_SPRING_URL}/characters/search`, {
      params: { name }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching characters', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/characters/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching character',
      error: error.message
    });
  }
});

module.exports = router;
