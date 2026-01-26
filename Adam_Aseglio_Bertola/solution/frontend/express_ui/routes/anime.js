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
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title } });

    // Client-side pagination
    const allResults = response.data;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.render('anime-search', {
      layout: false,
      title: 'Search Results',
      results: paginatedResults,
      query: title,
      searchTitle: title,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
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

router.get('/top/all', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const response = await axios.get(`${GATEWAY_URL}/anime/top/all`, { params: { limit } });

    res.render('anime-top', {
      layout: false,
      title: `Top ${limit} Rated Anime`,
      results: response.data,
      limit: limit
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error fetching top anime',
      error: { status: 500, stack: error.message }
    });
  }
});

router.get('/genre/:genre', async (req, res) => {
  try {
    const response = await axios.get(`${GATEWAY_URL}/anime/genre/${req.params.genre}`);

    res.render('anime-genre', {
      layout: false,
      title: `${req.params.genre} Anime`,
      results: response.data,
      genre: req.params.genre
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error fetching anime by genre',
      error: { status: 500, stack: error.message }
    });
  }
});

module.exports = router;
