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
  let { name, role, minFavorites, limit } = req.query;
  
  // Clean empty parameters
  name = name && name.trim() !== '' ? name.trim() : undefined;
  role = role && role.trim() !== '' ? role.trim() : undefined;
  minFavorites = minFavorites && minFavorites.trim() !== '' ? minFavorites : undefined;
  limit = limit && limit.trim() !== '' ? limit : undefined;
  
  // If no parameters, show search form
  if (!name && !role && !minFavorites && !limit) {
    return res.render('character-search', {
      layout : false,
      title  : 'Search Characters',
      query  : '',
      filters: {},
      results: null
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;
    
    const params = {};
    if (name) params.name = name;
    if (role) params.role = role;
    if (minFavorites) params.minFavorites = minFavorites;
    
    const response = await axios.get(`${GATEWAY_URL}/characters/search`, { params });
    let allResults = response.data;
    
    // Apply limit on frontend if specified
    if (limit && allResults.length > 0) {
      allResults = allResults.slice(0, parseInt(limit));
    }
    
    // Pagination
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    
    // Build base URL for pagination
    const queryParams = new URLSearchParams();
    if (name) queryParams.append('name', name);
    if (role) queryParams.append('role', role);
    if (minFavorites) queryParams.append('minFavorites', minFavorites);
    if (limit) queryParams.append('limit', limit);
    
    res.render('character-search', {
      layout : false,
      title  : 'Search Results',
      query  : name || '',
      filters: { name, role, minFavorites, limit },
      results: paginatedResults,
      baseUrl: `/characters/search?${queryParams.toString()}`,
      urlSeparator: '&',
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
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
    
    // Fetch anime appearances for this character
    let animeList = [];
    try {
      const animeWorksResponse = await axios.get(`${GATEWAY_URL}/character-anime/character/${req.params.id}`);
      
      // For each anime work, fetch the full anime details
      if (animeWorksResponse.data && animeWorksResponse.data.length > 0) {
        const animePromises = animeWorksResponse.data.map(work => 
          axios.get(`${GATEWAY_URL}/anime/${work.animeMalId}`)
            .then(response => ({...response.data, role: work.role}))
            .catch(() => null)
        );
        const animeResults = await Promise.all(animePromises);
        animeList = animeResults.filter(anime => anime !== null);
        
        // Sort by score descending (highest first)
        animeList.sort((a, b) => (b.score || 0) - (a.score || 0));
      }
    } catch (animeError) {
      console.error('Error fetching anime for character:', animeError.message);
      // Continue without anime list if there's an error
    }
    
    res.render('character-detail', {
      layout   : false,
      title    : `Character ${req.params.id}`,
      character: characterResponse.data,
      animeList: animeList
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
