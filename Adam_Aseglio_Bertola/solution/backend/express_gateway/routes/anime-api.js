const express = require('express');
const router = express.Router();
const axios = require('axios');

// Backend URLs
const BACKEND_SPRING_URL = 'http://localhost:8080/api';


router.get('/search', async (req, res) => {
  try {
    const title = req.query.title || '';
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/search`, {
      params: { title }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching anime', error: error.message });
  }
});



module.exports = router;
