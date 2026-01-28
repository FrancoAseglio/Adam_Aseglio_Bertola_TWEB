const express = require('express');
const router = express.Router();
const {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite
} = require('../controllers/favoriteController');

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: User favorites management
 */

/**
 * @swagger
 * /api/favorites/{username}:
 *   get:
 *     summary: Get all favorite anime for a user
 *     description: Retrieves all anime marked as favorite by the specified user
 *     tags: [Favorites]
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
 *         description: List of user's favorite anime
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       500:
 *         description: Server error
 */
router.get('/:username', async (req, res) => {
  try {
    const favorites = await getUserFavorites(req.params.username);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching favorites', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a new favorite anime for a user
 *     description: Creates a new favorite entry for an anime. Returns 409 if the anime is already favorited.
 *     tags: [Favorites]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - id
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username
 *                 example: "CKK2"
 *               id:
 *                 type: integer
 *                 description: Anime MAL ID
 *                 example: 21
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *       400:
 *         description: Invalid input validation error
 *       409:
 *         description: Anime is already in user's favorites
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { username, id, fav_type = 'anime' } = req.body;
    const favorite = await addUserFavorite(username, id, fav_type);
    res.status(201).json(favorite);
  } catch (error) {
    if (error.statusCode === 400)
      return res.status(400).json({ 
        message: 'Validation error', 
        error  : error.message 
      });

    if (error.statusCode === 409)
      return res.status(409).json({ 
        message: 'Conflict', 
        error  : error.message 
      });

    res.status(500).json({ 
      message: 'Error adding favorite', 
      error: error.message 
    });
  }
});

/**
 * @swagger
 * /api/favorites/{username}/{id}:
 *   delete:
 *     summary: Remove a favorite anime for a user
 *     description: Removes an anime from the user's favorites list
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *         example: "CKK2"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Anime MAL ID to remove
 *         example: 21
 *     responses:
 *       200:
 *         description: Favorite removed successfully
 *       404:
 *         description: Favorite not found
 *       500:
 *         description: Server error
 */
router.delete('/:username/:id', async (req, res) => {
  try {
    const fav_type = req.query.fav_type || 'anime';
    await removeUserFavorite(req.params.username, parseInt(req.params.id), fav_type);
    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    if (error.statusCode === 404) 
      return res.status(404).json({ 
        message: 'Not found', 
        error  : error.message 
      });
    
    if (error.statusCode === 400)
      return res.status(400).json({ 
        message: 'Validation error', 
        error  : error.message 
      });

    res.status(500).json({ 
      message: 'Error removing favorite', 
      error  : error.message
    });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       required:
 *         - username
 *         - id
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         username:
 *           type: string
 *           description: Username
 *           example: "CKK2"
 *         id:
 *           type: integer
 *           description: Anime MAL ID
 *           example: 21
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When favorite was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         username: "CKK2"
 *         id: 21
 *         createdAt: "2025-12-30T10:00:00.000Z"
 *         updatedAt: "2025-12-30T10:00:00.000Z"
 */

module.exports = router;
