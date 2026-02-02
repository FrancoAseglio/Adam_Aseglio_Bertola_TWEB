const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /anime/search:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Search and filter anime
 *     description: |
 *       Advanced anime search with multiple filtering options:
 *       - Search by title (partial match)
 *       - Filter by multiple genres (AND logic - must have ALL selected genres)
 *       - Filter by minimum score
 *       - Limit to top N rated anime
 *       - Pagination with 20 items per page
 *       
 *       Shows search form if no parameters provided.
 *     operationId: searchAnime
 *     parameters:
 *       - name: title
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by title
 *       - name: genres
 *         in: query
 *         schema:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *         description: Filter by genres (multiple uses AND logic)
 *       - name: minScore
 *         in: query
 *         schema:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 10
 *         description: Minimum score (0-10)
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *         description: Limit to top N rated
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
  let { title, genres, minScore, limit } = req.query;
  
  title = title && title.trim() !== '' ? title.trim() : undefined;
  minScore = minScore && minScore.trim() !== '' ? minScore : undefined;
  limit = limit && limit.trim() !== '' ? limit : undefined;
  
  let availableGenres = [];

  try {
    const genresResponse = await axios.get(`${GATEWAY_URL}/anime/genres`);
    availableGenres = genresResponse.data;
  } catch (error) {
    console.error('Error loading genres:', error.message);
  }

  const selectedGenres = genres ? (Array.isArray(genres) ? genres : [genres]) : [];
  
  const hasAnyFilter = title || selectedGenres.length > 0 || minScore || limit;
  if (!hasAnyFilter) {
    return res.render('anime-search', {
      title          : 'Search Anime',
      results        : null,
      filters        : {},
      availableGenres: availableGenres,
      selectedGenres : [],
      showWarning    : true
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;
    
    if (limit && parseInt(limit) > 10000) {
      return res.render('anime-search', {
        title          : 'Search Anime',
        results        : null,
        filters        : { title, minScore, limit },
        availableGenres: availableGenres,
        selectedGenres : selectedGenres,
        error          : 'Top Limit cannot exceed 10000'
      });
    }
    let allResults = [];
    let usedGenreAPI = false;

    if (title) {
      const params = { title };
      if (limit) params.limit = limit;
      const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params });
      allResults = response.data;
    } else if (selectedGenres.length > 0) {
      const params = {};
      if (limit) params.limit = limit;
      const response = await axios.get(`${GATEWAY_URL}/anime/genre/${selectedGenres[0]}`, { params });
      allResults = response.data;
      usedGenreAPI = true;
    } else {
      console.log('Fetching all anime for filtering...');
      const commonSearchTerms = ['a', 'the', 'no', 'de'];
      const promises = commonSearchTerms.map(term => 
        axios.get(`${GATEWAY_URL}/anime/search`, { params: { title: term } })
          .catch(err => ({ data: [] }))
      );
      const results = await Promise.all(promises);
      
      const combinedMap = new Map();
      results.forEach(result => {
        result.data.forEach(anime => {
          if (!combinedMap.has(anime.mal_id)) {
            combinedMap.set(anime.mal_id, anime);
          }
        });
      });
      allResults = Array.from(combinedMap.values());
      console.log(`Fetched ${allResults.length} unique anime for filtering`);
    }

    let filteredResults = allResults;

    if (selectedGenres.length > 0 && !(usedGenreAPI && selectedGenres.length === 1)) {
      const beforeFilter = filteredResults.length;
      filteredResults = filteredResults.filter(anime => {
        if (!anime.genres) return false;
        
        let animeGenres = [];
        if (typeof anime.genres === 'string') {
          animeGenres = anime.genres
            .replace(/[\[\]']/g, '')
            .split(',')
            .map(g => g.trim())
            .filter(g => g);
        } else if (Array.isArray(anime.genres)) {
          animeGenres = anime.genres.map(g => {
            if (typeof g === 'string') return g.trim();
            if (g && g.name) return g.name.trim();
            return '';
          });
        }
        
        return selectedGenres.every(selectedGenre => 
          animeGenres.some(ag => ag.toLowerCase() === selectedGenre.toLowerCase())
        );
      });
      console.log('Genre filter (AND logic):', beforeFilter, '→', filteredResults.length);
    }

    if (minScore) {
      const minScoreNum = parseFloat(minScore);
      filteredResults = filteredResults.filter(anime => anime.score && anime.score >= minScoreNum);
    }

    filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    
    filteredResults = filteredResults.map(anime => ({
      ...anime,
      imageUrl: anime.image_url
    }));

    const totalItems = filteredResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    const params = new URLSearchParams();
    if (title) params.append('title', title);
    selectedGenres.forEach(g => params.append('genres', g));
    if (minScore) params.append('minScore', minScore);
    if (limit) params.append('limit', limit);

    res.render('anime-search', {
      title          : 'Search Anime',
      results        : paginatedResults,
      filters        : { title, minScore, limit },
      availableGenres: availableGenres,
      selectedGenres : selectedGenres,
      baseUrl        : `/anime/search?${params.toString()}`,
      urlSeparator   : '&',
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
      message: 'Error searching anime',
      error: { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

/**
 * @swagger
 * /anime/genre/{genre}:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Get anime by genre
 *     description: Retrieves all anime in a specific genre. 20 items per page.
 *     operationId: getAnimeByGenre
 *     parameters:
 *       - name: genre
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Genre name
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Anime filtered by genre
 *       500:
 *         description: Server error
 */
router.get('/genre/:genre', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const response = await axios.get(`${GATEWAY_URL}/anime/genre/${req.params.genre}`);

    const allResults = response.data;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.render('anime-search', {
      title       : `${req.params.genre} Anime`,
      results     : paginatedResults,
      query       : req.params.genre,
      searchType  : 'genre',
      searchGenre : req.params.genre,
      baseUrl     : `/anime/genre/${encodeURIComponent(req.params.genre)}`,
      urlSeparator: '?',
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
      message: 'Error fetching anime by genre',
      error  : { 
        status: 500, 
        stack : error.message 
      }
    });
  }
});

/**
 * @swagger
 * /anime/stats/{id}:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Get anime statistics by ID
 *     description: |
 *       Retrieves detailed statistics for a specific anime including:
 *       - Watch status distribution (watching, completed, on hold, dropped, plan to watch)
 *       - Score distribution (votes and percentages for scores 1-10)
 *       - Total users tracking the anime
 *     operationId: getAnimeStatsById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MyAnimeList anime ID
 *         example: "1"
 *     responses:
 *       200:
 *         description: Anime statistics retrieved successfully
 *       404:
 *         description: Anime statistics not found
 *       500:
 *         description: Server error
 */
router.get('/stats/:id', async (req, res) => {
  try {
    const statsResponse = await axios.get(`${GATEWAY_URL}/stats/anime/${req.params.id}`);
    const { stats, animeDetails } = statsResponse.data;
    
    const combinedStats = {
      ...stats,
      ...(animeDetails || {})
    };
    
    res.render('anime-stats', {
      title: `${animeDetails?.title || 'Anime'} - Statistics`,
      stats: combinedStats,
      animeId: req.params.id
    });
  } catch (error) {
    console.error('Error fetching anime stats:', error.message);
    res.status(404).render('error', {
      message: 'Anime statistics not found',
      error  : { 
        status: 404, 
        stack : error.message 
      }
    });
  }
});

/**
 * @swagger
 * /anime/{id}/stats:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Get anime statistics by ID (alternative pattern)
 *     description: |
 *       Alternative URL pattern for retrieving anime statistics.
 *       Functionally identical to /anime/stats/{id}.
 *       Returns detailed statistics including watch status and score distribution.
 *     operationId: getAnimeStatsByIdAlt
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MyAnimeList anime ID
 *         example: "1"
 *     responses:
 *       200:
 *         description: Anime statistics retrieved successfully
 *       404:
 *         description: Anime statistics not found
 *       500:
 *         description: Server error
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const statsResponse = await axios.get(`${GATEWAY_URL}/stats/anime/${req.params.id}`);
    const { stats, animeDetails } = statsResponse.data;
    
    const combinedStats = {
      ...stats,
      ...(animeDetails || {})
    };
    
    res.render('anime-stats', {
      title: `${animeDetails?.title || 'Anime'} - Statistics`,
      stats: combinedStats,
      animeId: req.params.id
    });
  } catch (error) {
    console.error('Error fetching anime stats:', error.message);
    res.status(404).render('error', {
      message: 'Anime statistics not found',
      error  : { 
        status: 404, 
        stack : error.message 
      }
    });
  }
});

/**
 * @swagger
 * /anime/{id}:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Get anime details by ID
 *     description: |
 *       Retrieves detailed information about a specific anime including:
 *       - Basic anime information (title, synopsis, score, episodes)
 *       - Top characters appearing in the anime
 *       - Voice actors and staff members
 *       
 *       Note: This route must be defined last as /:id catches all paths.
 *     operationId: getAnimeById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d+$'
 *         description: MyAnimeList anime ID
 *         example: "1"
 *     responses:
 *       200:
 *         description: Successfully retrieved anime details with characters and staff
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with anime details
 *       404:
 *         description: Anime not found in database
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
  try {
    const animeResponse = await axios.get(`${GATEWAY_URL}/anime/${req.params.id}`);
    const anime = animeResponse.data;
    
    if (anime.image_url) anime.imageUrl = anime.image_url;
    if (anime.mal_id) anime.malId = anime.mal_id;
    
    let charactersList = [];
    try {
      const charactersResponse = await axios.get(`${GATEWAY_URL}/character-anime/anime/${req.params.id}/top`);
      const characterWorks = charactersResponse.data;
      
      const characterDetailsPromises = characterWorks.map(work => 
        axios.get(`${GATEWAY_URL}/characters/${work.characterMalId}`)
          .then(response => ({
            ...response.data,
            role: work.role
          }))
          .catch(err => {
            console.error(`Error fetching character ${work.characterMalId}:`, err.message);
            return null;
          })
      );
      
      const characterDetails = await Promise.all(characterDetailsPromises);
      charactersList = characterDetails.filter(char => char !== null);
    } catch (error) {
      console.error('Error fetching characters for anime:', error.message);
    }
    
    let peopleList = [];
    try {
      const peopleResponse = await axios.get(`${GATEWAY_URL}/person-voice-work/anime/${req.params.id}/top`);
      const peopleWorks = peopleResponse.data;
      
      const peopleDetailsPromises = peopleWorks.map(work => 
        axios.get(`${GATEWAY_URL}/people/${work.personMalId}`)
          .then(response => ({
            ...response.data,
            role: work.role,
            language: work.language
          }))
          .catch(err => {
            console.error(`Error fetching person ${work.personMalId}:`, err.message);
            return null;
          })
      );
      
      const peopleDetails = await Promise.all(peopleDetailsPromises);
      peopleList = peopleDetails.filter(person => person !== null);
    } catch (error) {
      console.error('Error fetching people for anime:', error.message);
    }
    
    res.render('anime-detail', {
      title : anime.title || `Anime ${req.params.id}`,
      anime : anime,
      charactersList: charactersList,
      peopleList: peopleList
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Anime not found',
      error: { 
        status: 404, 
        stack : error.message 
      }
    });
  }
});

module.exports = router;
