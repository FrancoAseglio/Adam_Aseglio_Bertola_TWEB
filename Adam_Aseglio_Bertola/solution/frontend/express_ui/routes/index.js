const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Home
 *     summary: Get home page with global statistics
 *     description: |
 *       Renders the home page of the Anime Data System with global platform statistics.
 *       
 *       Displays overview metrics including:
 *       - Total anime in database
 *       - Total registered users
 *       - Total ratings submitted
 *       - Total favorites
 *       - Average rating across platform
 *       - Most popular genres
 *       - Top rated anime
 *       
 *       If the gateway service is unavailable, gracefully degrades and renders
 *       the page with null statistics (error is logged but page still loads).
 *     operationId: getHomePage
 *     responses:
 *       200:
 *         description: Successfully rendered home page with global statistics
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML home page with platform statistics
 *       500:
 *         description: Home page rendered with null statistics (gateway connection failed)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML home page without statistics (graceful degradation)
 */
router.get('/', async function(req, res, next) {
  try {
    const response = await axios.get(`${GATEWAY_URL}/stats/global`);
    res.render('index', { 
      title      : 'Anime Data System',
      globalStats: response.data
    });
  } catch (error) {
    console.error('Error fetching global stats:', error.message);
    res.render('index', { 
      title      : 'Anime Data System',
      globalStats: null
    });
  }
});

module.exports = router;
