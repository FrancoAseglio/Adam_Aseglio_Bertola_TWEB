const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /ratings/{username}:
 *   get:
 *     tags:
 *       - Ratings
 *     summary: Get user's anime ratings
 *     description: |
 *       Retrieves all anime ratings for a specific user from the gateway service
 *       and renders them with pagination support. Shows 12 ratings per page.
 *       
 *       The response includes the full list of ratings paginated, total count,
 *       and pagination metadata for navigation.
 *     operationId: getUserRatings
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user whose ratings to retrieve
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
 *         description: Successfully retrieved user ratings with pagination
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with paginated user ratings
 *       404:
 *         description: User not found or has no ratings
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page indicating user not found
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
