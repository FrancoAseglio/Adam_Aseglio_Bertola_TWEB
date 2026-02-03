const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/person-voice-work/anime/{animeId}:
 *   get:
 *     summary: Get all people for a specific anime (Spring Boot/PostgreSQL backend)
 *     tags: [Person-Voice-Work]
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
 *         description: List of all people for the anime
 *       500:
 *         description: Server error
 */
router.get('/anime/:animeId', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/person-voice-work/anime/${req.params.animeId}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching people for anime', 
      error  : error.message 
    });
  }
});

module.exports = router;
