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
 *     summary: Search and filter characters
 *     description: |
 *       Advanced character search with multiple filtering options:
 *       - Search by character name (partial match)
 *       - Filter by role (Main, Supporting)
 *       - Filter by minimum favorites count
 *       - Limit results to top N characters
 *       - Pagination with 20 items per page
 *       
 *       Shows search form if no parameters provided.
 *     operationId: searchCharacters
 *     parameters:
 *       - name: name
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by character name
 *         examples:
 *           simple:
 *             value: "Naruto"
 *           full_name:
 *             value: "Naruto Uzumaki"
 *       - name: role
 *         in: query
 *         schema:
 *           type: string
 *           enum: [Main, Supporting]
 *         description: Filter by character role
 *       - name: minFavorites
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum number of favorites
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Limit to top N characters
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Search results or search form
 *       500:
 *         description: Server error
 */
router.get('/search', async (req, res) => {
  let { name, role, minFavorites, limit } = req.query;
  
  name = name && name.trim() !== '' ? name.trim() : undefined;
  role = role && role.trim() !== '' ? role.trim() : undefined;
  minFavorites = minFavorites !== undefined && minFavorites.trim() !== '' ? minFavorites.trim() : undefined;
  limit = limit && limit.trim() !== '' ? limit : undefined;
  
  const hasAnyQueryParam = Object.keys(req.query).length > 0;
  
  if (!hasAnyQueryParam) {
    return res.render('character-search', {
      title  : 'Search Characters',
      query  : '',
      filters: {},
      results: null
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;
    
    if (!name && !role && minFavorites === undefined && !limit) {
      return res.render('character-search', {
        title  : 'Search Characters',
        query  : '',
        filters: {},
        results: null,
        error  : 'Please provide at least one search filter: Name, Role, Minimum Favorites, or Top Limit'
      });
    }
    
    if (limit && parseInt(limit) > 100000) {
      return res.render('character-search', {
        title  : 'Search Characters',
        query  : name || '',
        filters: { name, role, minFavorites, limit },
        results: null,
        error  : 'Top Limit cannot exceed 50000'
      });
    }
    
    const params = {};
    if (name) params.name = name;
    if (role) params.role = role;
    if (minFavorites !== undefined) params.minFavorites = minFavorites;
    if (limit) params.limit = limit;
    
    const response = await axios.get(`${GATEWAY_URL}/characters/search`, { params });
    let allResults = response.data;
    
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);
    
    const resultsWithRoles = await Promise.all(paginatedResults.map(async (character) => {
      try {
        const worksResponse = await axios.get(`${GATEWAY_URL}/character-anime/character/${character.character_mal_id}`);
        if (worksResponse.data && worksResponse.data.length > 0) {
          const roles = worksResponse.data.map(work => work.role).filter(r => r);
          character.roles = [...new Set(roles)].sort((a, b) => {
            if (a === 'Main') return -1;
            if (b === 'Main') return 1;
            return 0;
          });
        } else {
          character.roles = [];
        }
      } catch (err) {
        character.roles = [];
      }
      return character;
    }));
    
    const queryParams = new URLSearchParams();
    if (name) queryParams.append('name', name);
    if (role) queryParams.append('role', role);
    if (minFavorites) queryParams.append('minFavorites', minFavorites);
    if (limit) queryParams.append('limit', limit);
    
    res.render('character-search', {
      title  : 'Search Results',
      query  : name || '',
      filters: { name, role, minFavorites, limit },
      results: resultsWithRoles,
      baseUrl: `/characters/search?${queryParams.toString()}`,
      urlSeparator: '&',
      pagination: {
        currentPage : page,
        totalPages  : totalPages,
        totalItems  : totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage : page < totalPages,
        hasPrevPage : page > 1
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
    const character = characterResponse.data;
    let animeList = [];
    let characterRoles = [];
    
    try {
      const animeWorksResponse = await axios.get(`${GATEWAY_URL}/character-anime/character/${req.params.id}`);
      
      if (animeWorksResponse.data && animeWorksResponse.data.length > 0) {
        const roles = animeWorksResponse.data.map(work => work.role).filter(r => r);
        characterRoles = [...new Set(roles)].sort((a, b) => {
          if (a === 'Main') return -1;
          if (b === 'Main') return 1;
          return 0;
        });
        
        const animePromises = animeWorksResponse.data.map(work => 
          axios.get(`${GATEWAY_URL}/anime/${work.animeMalId}`)
            .then(response => ({...response.data, role: work.role}))
            .catch(() => null)
        );
        const animeResults = await Promise.all(animePromises);
        animeList = animeResults.filter(anime => anime !== null);
        animeList.sort((a, b) => (b.score || 0) - (a.score || 0));
      }
    } catch (animeError) {
      console.error('Error fetching anime for character:', animeError.message);
    }
    
    character.roles = characterRoles;
    
    res.render('character-detail', {
      title    : `Character ${req.params.id}`,
      character: character,
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
