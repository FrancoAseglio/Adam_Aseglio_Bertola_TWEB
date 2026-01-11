const express = require('express');
const router = express.Router();
const {
  getProfileWithStats
} = require('../controllers/profileController');

/**
 * @swagger
 * tags:
 *   - name: Profiles
 *     description: User profile management
 */

/**
 * @swagger
 * /api/profiles/{username}/stats:
 *   get:
 *     summary: Get user profile with aggregated stats
 *     description: Retrieves user profile with additional statistics including ratings and favorites counts
 *     tags: [Profiles]
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
 *         description: User profile with stats
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Profile'
 *                 - type: object
 *                   properties:
 *                     userRatings:
 *                       type: integer
 *                       description: Total ratings count
 *                       example: 150
 *                     userFavorites:
 *                       type: integer
 *                       description: Total favorites count
 *                       example: 25
 *       404:
 *         description: Profile not found
 *       500:
 *         description: Server error
 */
router.get('/:username/stats', async (req, res) => {
  try {
    const profile = await getProfileWithStats(req.params.username);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile stats', error: error.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Profile:
 *       type: object
 *       required:
 *         - username
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         username:
 *           type: string
 *           description: Username
 *           example: "CKK2"
 *         gender:
 *           type: string
 *           description: User gender
 *           example: "Male"
 *         birthday:
 *           type: string
 *           description: Birthday
 *           example: "1990-05-15"
 *         location:
 *           type: string
 *           description: Location
 *           example: "Tokyo, Japan"
 *         joined:
 *           type: string
 *           description: Join date
 *           example: "2010-01-01"
 *         watching:
 *           type: integer
 *           description: Currently watching count
 *           example: 5
 *         completed:
 *           type: integer
 *           description: Completed anime count
 *           example: 150
 *         on_hold:
 *           type: integer
 *           description: On hold count
 *           example: 10
 *         dropped:
 *           type: integer
 *           description: Dropped count
 *           example: 5
 *         plan_to_watch:
 *           type: integer
 *           description: Plan to watch count
 *           example: 25
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
 *         username: "CKK2"
 *         gender: "Male"
 *         watching: 5
 *         completed: 150
 *         on_hold: 10
 *         dropped: 5
 *         plan_to_watch: 25
 */

module.exports = router;
