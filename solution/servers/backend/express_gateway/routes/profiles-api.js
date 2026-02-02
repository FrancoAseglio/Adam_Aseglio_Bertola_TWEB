const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const BACKEND_MONGO_URL  = 'http://localhost:3002/api';
const BACKEND_SPRING_URL = 'http://localhost:8080/api';

/**
 * @swagger
 * /api/profiles/{username}/full:
 *   get:
 *     summary: Get complete user profile with favorites and ratings
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *     responses:
 *       200:
 *         description: Complete profile data
 *       500:
 *         description: Server error
 */
router.get('/:username/full', async (req, res) => {
  try {
    const profileResponse = await axios.get(`${BACKEND_MONGO_URL}/profiles/${req.params.username}/stats`);
    const profile         = profileResponse.data;

    const favoritesResponse = await axios.get(`${BACKEND_MONGO_URL}/favorites/${req.params.username}`);
    const favorites         = favoritesResponse.data;

    const typeEndpoints = {
      'anime'    : 'anime',
      'character': 'characters',
      'people'   : 'people'
    };

    const enrichedFavorites = await Promise.all(
      favorites.slice(0, 20).map(async (fav) => {
        try {
          let detailsResponse;
          const endpoint = typeEndpoints[fav.fav_type];
          
          if (endpoint) detailsResponse = await axios.get(`${BACKEND_SPRING_URL}/${endpoint}/${fav.id}`);
          
          return {
            ...fav,
            details: detailsResponse ? detailsResponse.data : null
          };
        } catch (error) {
          console.error(`Error fetching details for ${fav.fav_type} ${fav.id}:`, error.message);
          
          return {
            ...fav,
            details: null
          };
        }
      })
    );

    const ratingsResponse = await axios.get(`${BACKEND_MONGO_URL}/ratings/${req.params.username}`);
    const ratings         = ratingsResponse.data.slice(0, 20);

    const enrichedRatings = await Promise.all(
      ratings.map(async (rating) => {
        try {
          const animeResponse = await axios.get(`${BACKEND_SPRING_URL}/anime/${rating.anime_id}`);

          return {
            ...rating,
            animeDetails: animeResponse.data
          };
        } catch (error) {
          console.error(`Error fetching anime details for ${rating.anime_id}:`, error.message);
          
          return {
            ...rating,
            animeDetails: null
          };
        }
      })
    );

    res.json({
      profile  : profile,
      favorites: enrichedFavorites,
      ratings  : enrichedRatings
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error fetching profile',
      error  : error.message
    });
  }
});

/**
 * @swagger
 * /api/profiles/{username}/stats:
 *   get:
 *     summary: Get user profile with statistics
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *     responses:
 *       200:
 *         description: Profile data with statistics
 *       500:
 *         description: Server error
 */
router.get('/:username/stats', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_MONGO_URL}/profiles/${req.params.username}/stats`);
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching profile stats', 
      error  : error.message 
    });
  }
});

module.exports = router;
