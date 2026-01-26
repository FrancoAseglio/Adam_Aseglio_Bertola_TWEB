const express = require('express');
const router = express.Router();
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/:username', async (req, res) => {
  try {
    const profileResponse = await axios.get(`${GATEWAY_URL}/profiles/${req.params.username}/full`);
    const data = profileResponse.data;

    res.render('profile', {
      layout: false,
      title: `${req.params.username} - Profile`,
      profile: data.profile,
      favorites: data.favorites,
      ratings: data.ratings,
      username: req.params.username
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).render('error', {
        message: 'Profile not found',
        error: { status: 404 }
      });
    } else {
      res.status(500).render('error', {
        message: 'Error fetching profile',
        error: { status: 500, stack: error.message }
      });
    }
  }
});
module.exports = router;

