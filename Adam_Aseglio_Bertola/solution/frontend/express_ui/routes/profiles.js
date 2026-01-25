const express = require('express');
const router = express.Router();
const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/:username', async (req, res) => {
  try {
    const profileResponse = await axios.get(`${GATEWAY_URL}/profiles/${req.params.username}/full`);
    
    res.render('profile', {
      layout: false,
      title: `Profile for ${req.params.username}`,
      username: req.params.username,
      profileData: profileResponse.data
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Profile not found',
      error: { status: 404, stack: error.message }
    });
  }
});

module.exports = router;

