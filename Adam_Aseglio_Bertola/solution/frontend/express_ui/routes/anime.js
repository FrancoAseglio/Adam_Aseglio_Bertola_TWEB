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

module.exports = router;
