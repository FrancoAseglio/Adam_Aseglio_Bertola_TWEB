const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/characters/search:
 *   get:
 *     summary: Search characters by name (Spring Boot/PostgreSQL backend)
 *     tags: [Characters]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Character name to search for
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [Main, Supporting]
 *         description: Character role (Main or Supporting)
 *       - in: query
 *         name: minFavorites
 *         schema:
 *           type: integer
 *         description: Minimum number of favorites
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of results to return
 *     responses:
 *       200:
 *         description: List of matching characters
 *       500:
 *         description: Server error
 */
router.get('/search', async (req, res) => {
  try {
    const { name, role, minFavorites, limit } = req.query;
    const params = {};
    
    if (name) params.name = name;
    if (role) params.role = role;
    if (minFavorites) params.minFavorites = minFavorites;
    if (limit) params.limit = limit;
    
    const response = await axios.get(`${BACKEND_SPRING_URL}/characters/search`, { params });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error searching characters', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get character by ID (Spring Boot/PostgreSQL backend)
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Character ID
 *         example: 12
 *     responses:
 *       200:
 *         description: Character details
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/characters/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching character',
      error  : error.message
    });
  }
});

/**
 * @swagger
 * /api/characters:
 *   post:
 *     summary: Add a new character (Spring Boot/PostgreSQL backend)
 *     tags: [Characters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - image
 *               - about
 *             properties:
 *               name:
 *                 type: string
 *                 description: Character name
 *                 example: "Monkey D. Luffy"
 *               image:
 *                 type: string
 *                 description: Character image URL
 *                 example: "https://cdn.myanimelist.net/images/characters/9/310307.jpg"
 *               about:
 *                 type: string
 *                 description: Character description
 *                 example: "Luffy is the captain of the Straw Hat Pirates..."
 *     responses:
 *       201:
 *         description: Character created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Character already exists
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${BACKEND_SPRING_URL}/characters`, req.body);
    res.status(201).json(response.data);
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
      message: 'Error adding character', 
      error  : error.message 
    });
  }
});

/**
 * @swagger
 * /api/characters/{id}:
 *   delete:
 *     summary: Remove a character (Spring Boot/PostgreSQL backend)
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Character ID
 *         example: 12
 *     responses:
 *       200:
 *         description: Character removed successfully
 *       404:
 *         description: Character not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${BACKEND_SPRING_URL}/characters/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({
        message: 'Not found',
        error  : error.response.data.error
      });
    }

    if (error.response?.status === 403) {
      return res.status(403).json({
        message: 'Forbidden',
        error  : error.response.data.error
      });
    }

    res.status(500).json({ 
      message: 'Error removing character', 
      error  : error.message 
    });
  }
});

module.exports = router;
