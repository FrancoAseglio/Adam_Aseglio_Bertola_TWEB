const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/people/{id}:
 *   get:
 *     summary: Get person by ID (Spring Boot/PostgreSQL backend)
 *     tags: [People]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Person ID
 *         example: 12
 *     responses:
 *       200:
 *         description: Person details
 *       404:
 *         description: Person not found
 *       500:
 *         description: Server error
 */
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_SPRING_URL}/people/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching person',
      error  : error.message
    });
  }
});

module.exports = router;
