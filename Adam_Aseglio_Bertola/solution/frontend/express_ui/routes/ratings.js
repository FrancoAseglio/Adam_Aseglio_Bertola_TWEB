const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * GET /ratings/:username
 * Render user ratings page with all anime ratings
 */
router.get('/:username', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 12;

    const ratingsResponse = await axios.get(`${GATEWAY_URL}/ratings/${req.params.username}`);
    const allRatings = ratingsResponse.data;

    const totalItems = allRatings.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedRatings = allRatings.slice(startIndex, endIndex);

    res.render('ratings', {
      layout         : false,
      title          : `${req.params.username} - Ratings`,
      ratings        : paginatedRatings,
      username       : req.params.username,
      allRatingsCount: totalItems,
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
    res.status(500).render('error', {
      message: 'Error fetching ratings',
      error  : { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

module.exports = router;
