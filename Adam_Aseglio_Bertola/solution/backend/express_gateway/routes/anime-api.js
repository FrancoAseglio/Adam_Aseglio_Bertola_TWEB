const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_MONGO_URL  = 'http://localhost:3002/api';
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
    const title = req.query.title || '';
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/search`, {
      params: { title }
    });
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
 * /api/anime/top/all:
 *   get:
 *     summary: Get top rated anime (Spring Boot/PostgreSQL backend)
 *     tags: [Anime]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: List of top anime
 *       500:
 *         description: Server error
 */
router.get('/top/all', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/top`, { params: { limit } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching top anime', 
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
 *     responses:
 *       200:
 *         description: List of anime in the genre
 *       500:
 *         description: Server error
 */
router.get('/genre/:genre', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/anime/genre/${req.params.genre}`);
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
 * /api/anime:
 *   get:
 *     summary: Get all anime with pagination
 *     tags: [Anime]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of anime
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_MONGO_URL}/anime`, { params: req.query });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching anime list', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/anime/mongo/{id}:
 *   get:
 *     summary: Get anime by ID (MongoDB backend)
 *     tags: [Anime]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Anime ID
 *     responses:
 *       200:
 *         description: Anime details
 *       404:
 *         description: Anime not found
 *       500:
 *         description: Server error
 */
router.get('/mongo/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_MONGO_URL}/anime/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching anime from MongoDB',
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
