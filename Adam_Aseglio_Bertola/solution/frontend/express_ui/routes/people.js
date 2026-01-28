const express = require('express');
const router = express.Router();
const axios = require('axios');

// Gateway URL
const GATEWAY_URL = 'http://localhost:3001/api';

router.get('/:id', async (req, res) => {
  try {
    const personResponse = await axios.get(`${GATEWAY_URL}/people/${req.params.id}`);
    const person = personResponse.data;

    res.render('person-details', {
      layout: false,
      title: person.name || `Person ${req.params.id}`,
      person: person
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Person not found',
      error: { status: 404 }
    });
  }
});

module.exports = router;
