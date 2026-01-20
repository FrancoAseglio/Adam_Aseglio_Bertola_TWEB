const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gateway URL
const GATEWAY_URL = 'http://localhost:3001/api';


router.get('/search', async (req, res) => {
  const title = req.query.title;
  if (!title) {
    return res.render('anime-search', {
      layout: false,
      title: 'Search Anime',
      results: null,
      query: null
    });
  }

  try {
    const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title } });

    res.render('anime-search', {
      layout: false,
      title: 'Search Results',
      results: response.data,
      query: title,
      searchTitle: title
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error searching anime',
      error: { status: 500, stack: error.message }
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const animeResponse = await axios.get(`${GATEWAY_URL}/anime/${req.params.id}`);
    
    res.render('anime-detail', {
      layout: false,
      title: `Anime ${req.params.id}`,
      anime: animeResponse.data
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Anime not found',
      error: { status: 404, stack: error.message }
    });
  }
});

module.exports = router;
