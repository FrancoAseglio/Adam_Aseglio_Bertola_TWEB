const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /characters/search:
 *   get:
 *     tags:
 *       - Characters
 *     summary: Search characters by name
 *     description: |
 *       Search for anime characters by name. If no name query parameter is provided,
 *       displays the search form. Otherwise, searches the gateway API and returns
 *       all matching characters.
 *     operationId: searchCharacters
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         description: Character name to search for (if empty, shows search form)
 *         schema:
 *           type: string
 *           minLength: 1
 *         examples:
 *           simple:
 *             value: "Naruto"
 *             summary: Simple name search
 *           full_name:
 *             value: "Naruto Uzumaki"
 *             summary: Full name search
 *           partial:
 *             value: "Conan"
 *             summary: Partial name search
 *     responses:
 *       200:
 *         description: Successfully retrieved search results or displayed search form
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with search results or search form
 *       500:
 *         description: Error during search
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page with error details
 */
router.get('/search', async (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.render('character-search', {
      layout : false,
      title  : 'Search Characters',
      query  : '',
      results: null
    });
  }

  try {
    const response = await axios.get(`${GATEWAY_URL}/characters/search`, { params: { name } });
    res.render('character-search', {
      layout : false,
      title  : 'Search Results',
      query  : name,
      results: response.data
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error searching characters',
      error  : { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

/**
 * @swagger
 * /characters/{id}:
 *   get:
 *     tags:
 *       - Characters
 *     summary: Get character details
 *     description: |
 *       Retrieves detailed information about a specific character by their
 *       MyAnimeList character ID. Includes biographical information, anime/manga
 *       appearances, and voice actors.
 *     operationId: getCharacterDetails
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MyAnimeList character ID
 *         schema:
 *           type: string
 *           pattern: '^\d+$'
 *         examples:
 *           edward:
 *             value: "11"
 *             summary: Edward Elric (Fullmetal Alchemist)
 *           levi:
 *             value: "45627"
 *             summary: Levi Ackerman (Attack on Titan)
 *           spike:
 *             value: "1"
 *             summary: Spike Spiegel (Cowboy Bebop)
 *     responses:
 *       200:
 *         description: Successfully retrieved character details
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with character details
 *       404:
 *         description: Character not found in database
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page indicating character was not found
 *       500:
 *         description: Internal server error
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page with error details
 */
router.get('/:id', async (req, res) => {
  try {
    const characterResponse = await axios.get(`${GATEWAY_URL}/characters/${req.params.id}`);
    
    res.render('character-detail', {
      layout   : false,
      title    : `Character ${req.params.id}`,
      character: characterResponse.data
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Character not found',
      error  : { 
        status: 404, 
        stack : error.message 
      }
    });
  }
});

module.exports = router;
