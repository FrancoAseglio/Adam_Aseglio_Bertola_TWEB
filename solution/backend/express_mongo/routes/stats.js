const express = require('express');
const router = express.Router();
const {
  getGlobalStats,
  getUserStats,
  getAnimeStats
} = require('../controllers/statsController');

/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: Platform and user statistics
 */

/**
 * @swagger
 * /api/stats/global:
 *   get:
 *     summary: Get global platform statistics
 *     description: Retrieves database-wide statistics including total counts for anime, profiles, ratings, and favorites
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Global statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GlobalStats'
 *       500:
 *         description: Server error
 */
router.get('/global', async (req, res) => {
  try {
    const stats = await getGlobalStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching global stats', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/stats/user/{username}:
 *   get:
 *     summary: Get user-specific statistics
 *     description: Retrieves comprehensive statistics for a specific user including ratings, favorites, and watch status breakdown
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *         example: "CKK2"
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStats'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/:username', async (req, res) => {
  try {
    const stats = await getUserStats(req.params.username);
    if (!stats) return res.status(404).json({ message: 'User not found' });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user stats', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/stats/anime/{malId}:
 *   get:
 *     summary: Get anime-specific statistics
 *     description: Retrieves detailed viewing statistics for a specific anime including watch status counts and score distribution
 *     tags: [Statistics]
 *     parameters:
 *       - in: path
 *         name: malId
 *         required: true
 *         schema:
 *           type: integer
 *         description: MyAnimeList ID
 *         example: 21
 *     responses:
 *       200:
 *         description: Anime statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 *       404:
 *         description: Anime stats not found
 *       500:
 *         description: Server error
 */
router.get('/anime/:malId', async (req, res) => {
  try {
    const stats = await getAnimeStats(parseInt(req.params.malId));
    if (!stats) return res.status(404).json({ message: 'Stats not found for this anime' });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching anime stats', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Stats:
 *       type: object
 *       required:
 *         - mal_id
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         mal_id:
 *           type: integer
 *           description: MyAnimeList ID
 *           example: 21
 *         watching:
 *           type: integer
 *           description: Number of users watching
 *           example: 50000
 *         completed:
 *           type: integer
 *           description: Number of users who completed
 *           example: 200000
 *         on_hold:
 *           type: integer
 *           description: Number of users on hold
 *           example: 10000
 *         dropped:
 *           type: integer
 *           description: Number of users who dropped
 *           example: 5000
 *         plan_to_watch:
 *           type: integer
 *           description: Number of users planning to watch
 *           example: 80000
 *         total:
 *           type: integer
 *           description: Total number of users
 *           example: 345000
 *         score_1_votes:
 *           type: integer
 *           description: Number of score 1 votes
 *           example: 100
 *         score_1_percentage:
 *           type: number
 *           description: Percentage of score 1
 *           example: 0.03
 *         score_2_votes:
 *           type: integer
 *           description: Number of score 2 votes
 *           example: 200
 *         score_2_percentage:
 *           type: number
 *           description: Percentage of score 2
 *           example: 0.06
 *         score_3_votes:
 *           type: integer
 *           description: Number of score 3 votes
 *           example: 500
 *         score_3_percentage:
 *           type: number
 *           description: Percentage of score 3
 *           example: 0.15
 *         score_4_votes:
 *           type: integer
 *           description: Number of score 4 votes
 *           example: 800
 *         score_4_percentage:
 *           type: number
 *           description: Percentage of score 4
 *           example: 0.23
 *         score_5_votes:
 *           type: integer
 *           description: Number of score 5 votes
 *           example: 1500
 *         score_5_percentage:
 *           type: number
 *           description: Percentage of score 5
 *           example: 0.43
 *         score_6_votes:
 *           type: integer
 *           description: Number of score 6 votes
 *           example: 3000
 *         score_6_percentage:
 *           type: number
 *           description: Percentage of score 6
 *           example: 0.87
 *         score_7_votes:
 *           type: integer
 *           description: Number of score 7 votes
 *           example: 8000
 *         score_7_percentage:
 *           type: number
 *           description: Percentage of score 7
 *           example: 2.32
 *         score_8_votes:
 *           type: integer
 *           description: Number of score 8 votes
 *           example: 25000
 *         score_8_percentage:
 *           type: number
 *           description: Percentage of score 8
 *           example: 7.25
 *         score_9_votes:
 *           type: integer
 *           description: Number of score 9 votes
 *           example: 80000
 *         score_9_percentage:
 *           type: number
 *           description: Percentage of score 9
 *           example: 23.19
 *         score_10_votes:
 *           type: integer
 *           description: Number of score 10 votes
 *           example: 226000
 *         score_10_percentage:
 *           type: number
 *           description: Percentage of score 10
 *           example: 65.51
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Record creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         mal_id: 21
 *         watching: 50000
 *         completed: 200000
 *         total: 345000
 *         score_10_votes: 226000
 *         score_10_percentage: 65.51
 *     GlobalStats:
 *       type: object
 *       properties:
 *         totalAnime:
 *           type: integer
 *           description: Total anime in database
 *           example: 15000
 *         totalProfiles:
 *           type: integer
 *           description: Total user profiles
 *           example: 50000
 *         totalRatings:
 *           type: integer
 *           description: Total ratings submitted
 *           example: 500000
 *         totalFavorites:
 *           type: integer
 *           description: Total favorites
 *           example: 100000
 *         calculatedAt:
 *           type: string
 *           format: date-time
 *           description: When statistics were calculated
 *       example:
 *         totalAnime: 15000
 *         totalProfiles: 50000
 *         totalRatings: 500000
 *         totalFavorites: 100000
 *         calculatedAt: "2026-01-01T12:00:00.000Z"
 *     UserStats:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Username
 *           example: "CKK2"
 *         totalRatings:
 *           type: integer
 *           description: Total ratings by user
 *           example: 150
 *         totalFavorites:
 *           type: integer
 *           description: Total favorites
 *           example: 25
 *         averageScore:
 *           type: string
 *           description: Average rating score
 *           example: "7.85"
 *         statusCounts:
 *           type: object
 *           properties:
 *             watching:
 *               type: integer
 *               example: 5
 *             completed:
 *               type: integer
 *               example: 100
 *             on_hold:
 *               type: integer
 *               example: 10
 *             dropped:
 *               type: integer
 *               example: 5
 *             plan_to_watch:
 *               type: integer
 *               example: 30
 *         profileData:
 *           $ref: '#/components/schemas/Profile'
 *         calculatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         username: "CKK2"
 *         totalRatings: 150
 *         totalFavorites: 25
 *         averageScore: "7.85"
 *         calculatedAt: "2026-01-01T12:00:00.000Z"
 */

module.exports = router;
