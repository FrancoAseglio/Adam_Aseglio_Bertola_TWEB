const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/anime/search:
 *   get:
 *     summary: Search anime by title (Spring Boot/PostgreSQL backend)
 *     tags: [Anime]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Anime title to search for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: List of matching anime
 *       500:
 *         description: Server error
 */
router.get('/search', async (req, res) => {
  try {
    const { title, limit } = req.query;
    const params = {};
    if (title) params.title = title;
    if (limit) params.limit = limit;
    
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/search`, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error searching anime', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/anime/genres:
 *   get:
 *     summary: Get all unique genres from the dataset
 *     tags: [Anime]
 *     responses:
 *       200:
 *         description: List of all unique genres
 *       500:
 *         description: Server error
 */
router.get('/genres', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/genres`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching genres', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/anime/genre/{genre}:
 *   get:
 *     summary: Get anime by genre (Spring Boot/PostgreSQL backend)
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: genre
 *         schema:
 *           type: string
 *         required: true
 *         description: Genre name
 *         example: Boys Love
 *     responses:
 *       200:
 *         description: List of anime in the genre
 *       500:
 *         description: Server error
 */
router.get('/genre/:genre', async (req, res) => {
  try {
    const params = {};
    if (req.query.limit) params.limit = req.query.limit;
    
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/genre/${req.params.genre}`, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching anime by genre', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/anime/{id}:
 *   get:
 *     summary: Get anime by ID (Spring Boot/PostgreSQL backend)
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Anime ID
 *         example: 21
 *     responses:
 *       200:
 *         description: Anime details
 *       404:
 *         description: Anime not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching anime',
      error  : error.message
    });
  }
});

module.exports = router;
