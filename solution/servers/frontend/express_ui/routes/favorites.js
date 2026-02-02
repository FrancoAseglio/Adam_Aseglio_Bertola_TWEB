const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /favorites/{username}:
 *   get:
 *     tags:
 *       - Favorites
 *     summary: Get user's favorite anime
 *     description: |
 *       Retrieves all favorite anime for a specific user from the gateway service
 *       and renders them with client-side pagination. Shows 12 favorites per page.
 *       
 *       The endpoint fetches all favorites at once and paginates them on the server
 *       before rendering.
 *     operationId: getUserFavorites
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user whose favorites to retrieve
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_-]+$'
 *         examples:
 *           simple:
 *             value: "CKK2"
 *             summary: Simple username
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (defaults to 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved user favorites with pagination
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with paginated user favorites
 *       404:
 *         description: User not found or has no favorites
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page
 *       500:
 *         description: Internal server error (gateway connection failure, database error, etc.)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page with error details
 */
router.get('/:username', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 12;

    const favoritesResponse = await axios.get(`${GATEWAY_URL}/favorites/${req.params.username}`);
    const allFavorites = favoritesResponse.data;

    const totalItems = allFavorites.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedFavorites = allFavorites.slice(startIndex, endIndex);

    res.render('favorites', {
      title            : `${req.params.username} - Favorites`,
      favorites        : paginatedFavorites,
      username         : req.params.username,
      allFavoritesCount: totalItems,
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
      message: 'Error fetching favorites',
      error  : { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

module.exports = router;
