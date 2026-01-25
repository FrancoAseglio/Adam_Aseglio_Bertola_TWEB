const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_MONGO_URL  = 'http://localhost:3002/api';
const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/favorites/{username}:
 *   get:
 *     summary: Get user's anime favorites with details
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Username
 *     responses:
 *       200:
 *         description: List of anime favorites with details
 *       500:
 *         description: Server error
 */
router.get('/:username', async (req, res) => {
  try {
    const favoritesResponse = await axios.get(`${BACKEND_MONGO_URL}/favorites/${req.params.username}`);
    const favorites         = favoritesResponse.data;

    const favoritesWithDetails = await Promise.all(
      favorites.map(async (fav) => {
        try {
          const detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${fav.id}`);

          return {
            ...fav,
            details: detailsResponse.data
          };
        } catch (error) {
          console.error(`Error fetching anime details for id ${fav.id}:`, error.message);
          
          return {
            ...fav,
            details: null
          };
        }
      })
    );

    res.json(favoritesWithDetails);
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
 *     summary: Add a new anime favorite for a user
 *     description: Creates a new anime favorite entry. Enriches the response with anime details from Spring Boot.
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
 *                 example: "CKK2"
 *               id:
 *                 type: integer
 *                 description: Anime MAL ID
 *                 example: 21
 *     responses:
 *       201:
 *         description: Favorite created successfully with enriched details
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Anime already in favorites
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const { username, id } = req.body;

    const favoriteResponse = await axios.post(`${BACKEND_MONGO_URL}/favorites`, { username, id });
    const favorite         = favoriteResponse.data;

    try {
      const detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${id}`);

      res.status(201).json({
        ...favorite,
        details: detailsResponse.data
      });
    } catch (detailsError) {
      console.error(`Error enriching favorite details:`, detailsError.message);
      
      res.status(201).json({
        ...favorite,
        details: null
      });
    }
  } catch (error) {
    if (error.response?.status === 409) {
      return res.status(409).json({
        message: 'Conflict',
        error : error.response.data.error
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        message: 'Validation error',
        error  : error.response.data.error
      });
    }

    res.status(500).json({ 
      message: 'Error adding favorite', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/favorites/{username}/{id}:
 *   delete:
 *     summary: Remove an anime favorite for a user
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Anime MAL ID
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
    await axios.delete(`${BACKEND_MONGO_URL}/favorites/${req.params.username}/${req.params.id}`);

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: 'Not found',
        error  : error.response.data.error
      });
    }

    res.status(500).json({ 
      message: 'Error removing favorite', 
      error  : error.message 
    });
  }
});

module.exports = router;
