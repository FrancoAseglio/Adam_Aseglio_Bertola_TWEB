const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gateway URL
const GATEWAY_URL = 'http://localhost:3001/api';


router.get('/search', async (req, res) => {
  const { title, genres, minScore, limit } = req.query;
  
  // Carica sempre la lista dei generi disponibili
  let availableGenres = [];
  try {
    const genresResponse = await axios.get(`${GATEWAY_URL}/anime/genres`);
    availableGenres = genresResponse.data;
  } catch (error) {
    console.error('Error loading genres:', error.message);
  }

  // Converti genres in array se è stringa
  const selectedGenres = genres ? (Array.isArray(genres) ? genres : [genres]) : [];
  
  // Se non ci sono parametri, mostra form vuoto
  if (!title && selectedGenres.length === 0 && !minScore && !limit) {
    return res.render('anime-search', {
      layout: false,
      title: 'Search Anime',
      results: null,
      filters: {},
      availableGenres: availableGenres,
      selectedGenres: []
    });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;
    let allResults = [];

    // Determina quale endpoint chiamare in base ai filtri
    if (title) {
      // Se c'è title, cerca per titolo
      const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title } });
      allResults = response.data;
    } else if (selectedGenres.length > 0) {
      // Se ci sono solo genres, cerca per primo genere
      const response = await axios.get(`${GATEWAY_URL}/anime/genre/${selectedGenres[0]}`);
      allResults = response.data;
    } else if (limit) {
      // Se c'è solo limit (top rated), prendi i top
      const response = await axios.get(`${GATEWAY_URL}/anime/top/all`, { params: { limit: parseInt(limit) } });
      allResults = response.data;
    } else {
      // Fallback: cerca tutto
      const response = await axios.get(`${GATEWAY_URL}/anime/search`, { params: { title: '' } });
      allResults = response.data;
    }

    // Applica filtri client-side
    let filteredResults = allResults;

    // Se limit è specificato con altri filtri, prendi solo i top N dopo il filtering
    if (limit && (title || selectedGenres.length > 0)) {
      // Ordina per score prima di limitare
      filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));
      filteredResults = filteredResults.slice(0, parseInt(limit));
    }

    // Filtra per TUTTI i generi selezionati (AND logic)
    if (selectedGenres.length > 0) {
      filteredResults = filteredResults.filter(anime => {
        if (!anime.genres) return false;
        
        // Normalizza genres in array
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
        
        // L'anime deve avere TUTTI i generi selezionati
        return selectedGenres.every(selectedGenre => 
          animeGenres.some(ag => 
            ag.toLowerCase() === selectedGenre.toLowerCase()
          )
        );
      });
    }

    // Filtra per score minimo se specificato
    if (minScore) {
      const minScoreNum = parseFloat(minScore);
      filteredResults = filteredResults.filter(anime => 
        anime.score && anime.score >= minScoreNum
      );
    }

    // Ordina per score se richiesto top rated
    if (limit || minScore) {
      filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    // Normalizza snake_case in camelCase per il frontend
    filteredResults = filteredResults.map(anime => ({
      ...anime,
      imageUrl: anime.image_url
    }));

    // Paginazione
    const totalItems = filteredResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = filteredResults.slice(startIndex, endIndex);

    // Costruisci baseUrl con tutti i parametri
    const params = new URLSearchParams();
    if (title) params.append('title', title);
    selectedGenres.forEach(g => params.append('genres', g));
    if (minScore) params.append('minScore', minScore);
    if (limit) params.append('limit', limit);

    res.render('anime-search', {
      layout: false,
      title: 'Search Anime',
      results: paginatedResults,
      filters: { title, minScore, limit },
      availableGenres: availableGenres,
      selectedGenres: selectedGenres,
      baseUrl: `/anime/search?${params.toString()}`,
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
      message: 'Error searching anime',
      error: { status: 500, stack: error.message }
    });
  }
});

router.get('/top/all', async (req, res) => {
  try {
    const limit = req.query.limit || 20;
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const response = await axios.get(`${GATEWAY_URL}/anime/top/all`, { params: { limit } });

    // Client-side pagination
    const allResults = response.data;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.render('anime-search', {
      layout: false,
      title: `Top ${limit} Rated Anime`,
      results: paginatedResults,
      query: `Top ${limit}`,
      searchType: 'top',
      searchLimit: limit,
      baseUrl: `/anime/top/all?limit=${limit}`,
      urlSeparator: '&',
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: limit
      }
    });
  } catch (error) {
    res.status(500).render('error', {
      message: 'Error fetching top anime',
      error: { status: 500, stack: error.message }
    });
  }
});

router.get('/genre/:genre', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 20;

    const response = await axios.get(`${GATEWAY_URL}/anime/genre/${req.params.genre}`);

    // Client-side pagination
    const allResults = response.data;
    const totalItems = allResults.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.render('anime-search', {
      layout: false,
      title: `${req.params.genre} Anime`,
      results: paginatedResults,
      query: req.params.genre,
      searchType: 'genre',
      searchGenre: req.params.genre,
      baseUrl: `/anime/genre/${encodeURIComponent(req.params.genre)}`,
      urlSeparator: '?',
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
      message: 'Error fetching anime by genre',
      error: { status: 500, stack: error.message }
    });
  }
});

// Route for anime statistics - specific path to avoid conflicts
router.get('/stats/:id', async (req, res) => {
  try {
    const statsResponse = await axios.get(`${GATEWAY_URL}/stats/anime/${req.params.id}`);
    const { stats, animeDetails } = statsResponse.data;
    
    // Merge stats with anime details
    const combinedStats = {
      ...stats,
      ...(animeDetails || {})
    };
    
    res.render('anime-stats', {
      layout: false,
      title: `${animeDetails?.title || 'Anime'} - Statistics`,
      stats: combinedStats,
      animeId: req.params.id
    });
  } catch (error) {
    console.error('Error fetching anime stats:', error.message);
    res.status(404).render('error', {
      layout: false,
      message: 'Anime statistics not found',
      error: { status: 404, stack: error.message }
    });
  }
});

// Route for anime statistics - alternative pattern
router.get('/:id/stats', async (req, res) => {
  try {
    const statsResponse = await axios.get(`${GATEWAY_URL}/stats/anime/${req.params.id}`);
    const { stats, animeDetails } = statsResponse.data;
    
    // Merge stats with anime details
    const combinedStats = {
      ...stats,
      ...(animeDetails || {})
    };
    
    res.render('anime-stats', {
      layout: false,
      title: `${animeDetails?.title || 'Anime'} - Statistics`,
      stats: combinedStats,
      animeId: req.params.id
    });
  } catch (error) {
    console.error('Error fetching anime stats:', error.message);
    res.status(404).render('error', {
      layout: false,
      message: 'Anime statistics not found',
      error: { status: 404, stack: error.message }
    });
  }
});

// This route must be LAST because /:id catches all paths
router.get('/:id', async (req, res) => {
  try {
    const animeResponse = await axios.get(`${GATEWAY_URL}/anime/${req.params.id}`);
    const anime = animeResponse.data;
    
    if (anime.image_url) {
      anime.imageUrl = anime.image_url;
    }
    if (anime.mal_id) {
      anime.malId = anime.mal_id;
    }
    
    res.render('anime-detail', {
      layout: false,
      title: anime.title || `Anime ${req.params.id}`,
      anime: anime
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Anime not found',
      error: { status: 404, stack: error.message }
    });
  }
});

module.exports = router;
