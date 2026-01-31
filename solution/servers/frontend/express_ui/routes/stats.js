const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /stats:
 *   get:
 *     tags:
 *       - Global Statistics
 *     summary: Get global platform statistics
 *     description: Retrieves platform-wide statistics from the gateway service and renders them in an HTML view
 *     operationId: getGlobalStats
 *     responses:
 *       200:
 *         description: Successfully retrieved and rendered global statistics
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with global statistics
 *       500:
 *         description: Error fetching statistics from gateway (renders page with null stats)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with error state
 */
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

/**
 * @swagger
 * /stats/user/{username}:
 *   get:
 *     tags:
 *       - User Statistics
 *     summary: Get user-specific statistics
 *     description: Retrieves statistics for a specific user by username and renders them in an HTML view
 *     operationId: getUserStats
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user to retrieve statistics for
 *         schema:
 *           type: string
 *           example: CKK2
 *     responses:
 *       200:
 *         description: Successfully retrieved user statistics
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with user statistics
 *       404:
 *         description: User not found
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page showing user not found
 *       500:
 *         description: Internal server error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page
 */
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

/**
 * @swagger
 * /stats/anime/{animeId}:
 *   get:
 *     tags:
 *       - Anime Statistics
 *     summary: Get anime-specific statistics
 *     description: Retrieves detailed statistics and information for a specific anime by ID
 *     operationId: getAnimeStats
 *     parameters:
 *       - name: animeId
 *         in: path
 *         required: true
 *         description: Unique identifier of the anime
 *         schema:
 *           type: string
 *           example: "41"
 *     responses:
 *       200:
 *         description: Successfully retrieved anime statistics
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with anime statistics and details
 *       500:
 *         description: Error fetching anime statistics
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page with error details
 */
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
