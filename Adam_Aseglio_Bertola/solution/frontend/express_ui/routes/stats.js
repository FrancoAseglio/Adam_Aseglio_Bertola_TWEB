const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/', async function(req, res, next) {
  try {
    const response = await axios.get(`${GATEWAY_URL}/stats/global`);
    res.render('stats', { 
      title      : 'Platform Statistics',
      globalStats: response.data
    });
  } catch (error) {
    console.error('Error fetching global stats:', error.message);
    res.render('stats', { 
      title      : 'Platform Statistics',
      globalStats: null
    });
  }
});

router.get('/user/:username', async (req, res) => {
  try {
    const response = await axios.get(`${GATEWAY_URL}/stats/user/${req.params.username}`);
    res.render('user-stats', {
      layout   : false,
      title    : `${req.params.username} - Statistics`,
      userStats: response.data,
      username : req.params.username
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.render('user-stats', {
        layout   : false,
        title    : 'User Not Found',
        userStats: null,
        username : req.params.username
      });
    } else {
      res.status(500).render('error', {
        message: 'Error fetching user stats',
        error  : { 
          status: 500, 
          stack : error.message 
        }
      });
    }
  }
});

router.get('/search', async (req, res) => {
  const query = req.query.title;

  if (!query) {
    return res.render('anime-stats-search', {
      layout : false,
      title  : 'Search Anime Statistics',
      query  : '',
      results: null
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title: query, limit: 30 } });

    const allResults = response.data;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.render('anime-stats-search', {
      layout     : false,
      title      : `Search Results - ${query}`,
      query      : query,
      searchTitle: query,
      results    : paginatedResults,
      pagination: {
        currentPage : page,
        totalPages  : totalPages,
        totalItems  : totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage : page < totalPages,
        hasPrevPage : page > 1
      }
    });
  } catch (error) {
    res.render('anime-stats-search', {
      layout : false,
      title  : 'Search Anime Statistics',
      query  : query,
      results: []
    });
  }
});

router.get('/anime/:animeId', async (req, res) => {
  try {
    const response = await axios.get(`${GATEWAY_URL}/stats/anime/${req.params.animeId}`);
    const { stats, animeDetails } = response.data;

    res.render('anime-stats', {
      layout      : false,
      title       : animeDetails?.title ? `${animeDetails.title} - Statistics` : `Anime ${req.params.animeId} - Statistics`,
      stats       : stats,
      animeDetails: animeDetails,
      animeId     : req.params.animeId
    });
  } catch (error) {
    console.error('Error fetching anime statistics:', error.message);
    res.status(500).render('error', {
      message: 'Error fetching anime statistics',
      error  : { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

module.exports = router;
