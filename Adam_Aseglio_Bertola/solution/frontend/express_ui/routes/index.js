const express = require('express');
const router = express.Router();
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/* GET home page with global stats */
router.get('/', async function(req, res, next) {
  try {
    const response = await axios.get(`${GATEWAY_URL}/stats/global`);
    res.render('index', { 
      title: 'Anime Data System',
      globalStats: response.data
    });
  } catch (error) {
    console.error('Error fetching global stats:', error.message);
    res.render('index', { 
      title: 'Anime Data System',
      globalStats: null
    });
  }
});

module.exports = router;
