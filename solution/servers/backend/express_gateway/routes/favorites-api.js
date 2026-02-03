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
 *         example: "CKK2"
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
          let detailsResponse;
          const favType = fav.fav_type || 'anime';

          switch (favType) {
            case 'character':
              detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/characters/${fav.id}`);
              break;
            case 'people':
              detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/people/${fav.id}`);
              break;
            case 'anime':
            default:
              detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${fav.id}`);
              break;
          }

          return {
            ...fav,
            details: detailsResponse.data
          };
        } catch (error) {
          console.error(`Error fetching ${fav.fav_type || 'anime'} details for id ${fav.id}:`, error.message);

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
 *                 description: Username
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
    const { username, id, fav_type = 'anime' } = req.body;

    const favoriteResponse = await axios.post(`${BACKEND_MONGO_URL}/favorites`, { username, id, fav_type });
    const favorite         = favoriteResponse.data;

    try {
      let detailsResponse;

      switch (fav_type) {
        case 'character':
          detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/characters/${id}`);
          break;
        case 'people':
          detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/people/${id}`);
          break;
        case 'anime':
        default:
          detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${id}`);
          break;
      }

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
        error  : error.response.data.error
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
 *         description: Username
 *         example: "CKK2"
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Anime MAL ID
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
    await axios.delete(`${BACKEND_MONGO_URL}/favorites/${req.params.username}/${req.params.id}?fav_type=${fav_type}`);
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: 'Favorite not found',
        error  : error.response.data.error
      });
    }

    res.status(500).json({
      message: 'Server error',
      error  : error.message
    });
  }
});

module.exports = router;
