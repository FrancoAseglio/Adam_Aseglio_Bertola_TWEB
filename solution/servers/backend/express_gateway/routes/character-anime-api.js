const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/character-anime/character/{characterId}:
 *   get:
 *     summary: Get all anime for a specific character (Spring Boot/PostgreSQL backend)
 *     tags: [Character-Anime]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Character ID
 *         example: 21
 *     responses:
 *       200:
 *         description: List of anime works for the character
 *       500:
 *         description: Server error
 */
router.get('/character/:characterId', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/character-anime/character/${req.params.characterId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching anime for character', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/character-anime/anime/{animeId}:
 *   get:
 *     summary: Get all characters for a specific anime (Spring Boot/PostgreSQL backend)
 *     tags: [Character-Anime]
 *     parameters:
 *       - in: path
 *         name: animeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Anime ID
 *         example: 21
 *     responses:
 *       200:
 *         description: List of characters for the anime
 *       500:
 *         description: Server error
 */
router.get('/anime/:animeId', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/character-anime/anime/${req.params.animeId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching characters for anime', 
      error  : error.message 
    });
  }
});

module.exports = router;
