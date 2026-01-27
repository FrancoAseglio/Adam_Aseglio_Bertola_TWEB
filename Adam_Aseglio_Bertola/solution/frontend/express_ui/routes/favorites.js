const express = require('express');
const router = express.Router();
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/:username', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 12;

    const favoritesResponse = await axios.get(`${GATEWAY_URL}/favorites/${req.params.username}`);
    const allFavorites = favoritesResponse.data;

    // Client-side pagination
    const totalItems = allFavorites.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFavorites = allFavorites.slice(startIndex, endIndex);

    res.render('favorites', {
      layout: false,
      title: `${req.params.username} - Favorites`,
      favorites: paginatedFavorites,
      username: req.params.username,
      allFavoritesCount: totalItems,
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
      message: 'Error fetching favorites',
      error: { status: 500, stack: error.message }
    });
  }
});

module.exports = router;
