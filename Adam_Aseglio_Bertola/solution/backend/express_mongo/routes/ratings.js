const express = require('express');
const router = express.Router();
const {
  getUserRatings
} = require('../controllers/ratingController');

/**
 * @swagger
 * tags:
 *   - name: Ratings
 *     description: User anime ratings management
 */

/**
 * @swagger
 * /api/ratings/{username}:
 *   get:
 *     summary: Get all ratings for a user
 *     description: Retrieves all anime ratings submitted by a specific user
 *     tags: [Ratings]
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
 *         description: List of user ratings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 *       500:
 *         description: Server error
 */
router.get('/:username', async (req, res) => {
  try {
    const ratings = await getUserRatings(req.params.username);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       required:
 *         - username
 *         - anime_id
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         username:
 *           type: string
 *           description: Username
 *           example: "CKK2"
 *         anime_id:
 *           type: integer
 *           description: Anime ID (MAL ID)
 *           example: 21
 *         status:
 *           type: string
 *           description: Watch status
 *           enum: [watching, completed, on_hold, dropped, plan_to_watch]
 *           example: "completed"
 *         score:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *           description: User rating (0-10)
 *           example: 8
 *         is_rewatching:
 *           type: number
 *           description: Rewatching flag (0 or 1)
 *           example: 0
 *         num_watched_episodes:
 *           type: number
 *           description: Number of episodes watched
 *           example: 12
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When rating was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         username: "CKK2"
 *         anime_id: 21
 *         status: "completed"
 *         score: 8
 *         is_rewatching: 0
 *         num_watched_episodes: 12
 *         createdAt: "2025-12-30T10:00:00.000Z"
 *         updatedAt: "2025-12-30T10:00:00.000Z"
 */

module.exports = router;
