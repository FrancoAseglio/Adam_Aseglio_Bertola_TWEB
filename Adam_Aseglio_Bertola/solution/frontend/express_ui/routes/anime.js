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
  const { title, genres, minScore, limit } = req.query;
  let availableGenres = [];

  try {
    const genresResponse = await axios.get(`${GATEWAY_URL}/anime/genres`);
    availableGenres = genresResponse.data;
  } catch (error) {
    console.error('Error loading genres:', error.message);
  }

  const selectedGenres = genres ? (Array.isArray(genres) ? genres : [genres]) : [];
  
  if (!title && selectedGenres.length === 0 && !minScore && !limit) {
    return res.render('anime-search', {
      layout         : false,
      title          : 'Search Anime',
      results        : null,
      filters        : {},
      availableGenres: availableGenres,
      selectedGenres : []
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;
    let allResults = [];

    if (title) {
      const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title } });
      allResults     = response.data;
    } else if (selectedGenres.length > 0) {
      const response = await axios.get(`${GATEWAY_URL}/anime/genre/${selectedGenres[0]}`);
      allResults     = response.data;
    } else if (limit) {
      const response = await axios.get(`${GATEWAY_URL}/anime/top/all`, { params: { limit: parseInt(limit) } });
      allResults     = response.data;
    } else {
      const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title: '' } });
      allResul wts     = response.data;
    }

    let filteredResults = allResults;

    if (limit && (title || selectedGenres.length > 0)) {
      filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));
      filteredResults = filteredResults.slice(0, parseInt(limit));
    }

    if (selectedGenres.length > 0) {
      filteredResults = filteredResults.filter(anime => {
        if (!anime.genres) return false;
        
        let animeGenres = [];
        if (typeof anime.genres === 'string') {
          animeGenres = anime.genres.split(',').map(g => g.trim());
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
    }

    if (minScore) {
      const minScoreNum = parseFloat(minScore);
      filteredResults = filteredResults.filter(anime => anime.score && anime.score >= minScoreNum);
    }

    if (limit || minScore) filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));

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
      layout         : false,
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
 * /anime/top/all:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Get top rated anime
 *     description: Retrieves top rated anime, sorted by score descending. 20 items per page.
 *     operationId: getTopAnime
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of top anime to retrieve
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Top rated anime
 *       500:
 *         description: Server error
 */
router.get('/top/all', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const page  = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const response = await axios.get(`${GATEWAY_URL}/anime/top/all`, { params: { limit } });

    const allResults = response.data;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex   = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.render('anime-search', {
      layout      : false,
      title       : `Top ${limit} Rated Anime`,
      results     : paginatedResults,
      query       : `Top ${limit}`,
      searchType  : 'top',
      searchLimit : limit,
      baseUrl     : `/anime/top/all?limit=${limit}`,
      urlSeparator: '&',
      pagination: {
        currentPage : page,
        totalPages  : totalPages,
        totalItems  : totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage : page < totalPages,
        hasPrevPage : page > 1,
        limit       : limit
      }
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error fetching top anime',
      error  : { 
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
      layout      : false,
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
 * /anime/{id}:
 *   get:
 *     tags:
 *       - Anime
 *     summary: Get anime details by ID
 *     description: |
 *       Retrieves detailed information about a specific anime.
 *       Note: This route must be last as /:id catches all paths.
 *     operationId: getAnimeById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: MyAnimeList anime ID
 *     responses:
 *       200:
 *         description: Anime details
 *       404:
 *         description: Anime not found
 */
router.get('/:id', async (req, res) => {
  try {
    const animeResponse = await axios.get(`${GATEWAY_URL}/anime/${req.params.id}`);
    const anime = animeResponse.data;
    
    if (anime.image_url) anime.imageUrl = anime.image_url;
    
    res.render('anime-detail', {
      layout: false,
      title : anime.title || `Anime ${req.params.id}`,
      anime : anime
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
