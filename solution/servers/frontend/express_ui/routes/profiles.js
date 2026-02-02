const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /profile:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: Display user profile search page
 *     description: |
 *       Renders a search page where users can enter a username to view a profile.
 *       This is the entry point for profile browsing.
 *     operationId: getProfileSearchPage
 *     responses:
 *       200:
 *         description: Profile search page rendered successfully
 */
router.get('/', async (req, res) => {
  res.render('profile-search', {
    title: 'Search User Profiles'
  });
});

/**
 * @swagger
 * /profile/{username}:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: Get complete user profile
 *     description: |
 *       Retrieves comprehensive user profile information from the gateway service.
 *       Returns a complete profile including:
 *       - User profile details (bio, avatar, statistics)
 *       - User's favorite anime list
 *       - User's anime ratings
 *       
 *       All data is fetched in a single call to /profiles/{username}/full endpoint.
 *     operationId: getUserProfile
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         description: Username of the user whose profile to retrieve
 *         schema:
 *           type: string
 *           pattern: '^[a-zA-Z0-9_-]+$'
 *         examples:
 *           simple:
 *             value: "CKK2"
 *             summary: Simple username
 *     responses:
 *       200:
 *         description: Successfully retrieved complete user profile
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with user profile, favorites, and ratings
 *       404:
 *         description: Profile not found
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page indicating profile was not found
 *       500:
 *         description: Internal server error (gateway connection failure, database error, etc.)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page with error details
 */
router.get('/:username', async (req, res) => {
  try {
    const profileResponse = await axios.get(`${GATEWAY_URL}/profiles/${req.params.username}/full`);
    const data = profileResponse.data;
    
    res.render('profile', {
      title    : `${req.params.username} - Profile`,
      profile  : data.profile,
      favorites: data.favorites,
      ratings  : data.ratings,
      username : req.params.username
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).render('error', {
        message: 'Profile not found',
        error  : { status: 404 }
      });
    } else {
      res.status(500).render('error', {
        message: 'Error fetching profile',
        error  : { status: 500, stack: error.message }
      });
    }
  }
});

module.exports = router;
