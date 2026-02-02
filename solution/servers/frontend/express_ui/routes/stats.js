const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /stats/user/{username}:
 *   get:
 *     tags:
 *       - User Statistics
 *     summary: Get user-specific statistics
 *     description: |
 *       Retrieves comprehensive statistics for a specific user including:
 *       - Total ratings submitted
 *       - Total favorites
 *       - Average score given
 *       - Watch status breakdown (watching, completed, on hold, dropped, plan to watch)
 *     operationId: getUserStats
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user whose statistics to retrieve
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_-]+$'
 *         example: "CKK2"
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
 *               description: Rendered page indicating user not found
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
      title    : `${req.params.username} - Statistics`,
      userStats: response.data,
      username : req.params.username
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.render('user-stats', {
        title    : 'User Not Found',
        userStats: null,
        username : req.params.username
      });
    } else {
      res.status(500).render('error', {
        message: 'Error fetching user statistics',
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
 *     summary: Get anime statistics
 *     description: |
 *       Retrieves detailed statistics for a specific anime including:
 *       - Watch status distribution
 *       - Score distribution (votes for scores 1-10)
 *       - Total users tracking the anime
 *     operationId: getAnimeStats
 *     parameters:
 *       - name: animeId
 *         in: path
 *         required: true
 *         description: MyAnimeList anime ID
 *         schema:
 *           type: string
 *           pattern: '^\d+$'
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved anime statistics
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with anime statistics
 *       404:
 *         description: Anime not found
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page
 *       500:
 *         description: Internal server error
 */
router.get('/anime/:animeId', async (req, res) => {
  try {
    const response = await axios.get(`${GATEWAY_URL}/stats/anime/${req.params.animeId}`);
    const { stats, animeDetails } = response.data;

    res.render('anime-stats', {
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
