const express = require('express');
const router  = express.Router();
const axios   = require('axios');

const GATEWAY_URL = 'http://localhost:3001/api';

/**
 * @swagger
 * /people/{id}:
 *   get:
 *     tags:
 *       - People
 *     summary: Get person details
 *     description: |
 *       Retrieves detailed information about a person (staff member or voice actor)
 *       from the gateway service. Returns biographical information, roles in anime,
 *       and other related data.
 *       
 *       Covers:
 *       - Voice actors
 *       - Directors
 *       - Producers
 *       - Composers
 *       - Other anime staff
 *     operationId: getPersonDetails
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: MyAnimeList person ID
 *         schema:
 *           type: string
 *           pattern: '^\d+$'
 *         examples:
 *           miyazaki:
 *             value: "1870"
 *             summary: Hayao Miyazaki (Director)
 *           kamiya:
 *             value: "118"
 *             summary: Hiroshi Kamiya (Voice Actor)
 *           sawano:
 *             value: "8509"
 *             summary: Hiroyuki Sawano (Composer)
 *     responses:
 *       200:
 *         description: Successfully retrieved person details
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered HTML page with person's biographical information and roles
 *       404:
 *         description: Person not found in database
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: Rendered error page indicating person was not found
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
    const personResponse = await axios.get(`${GATEWAY_URL}/people/${req.params.id}`);
    const person = personResponse.data;
    
    res.render('person-details', {
      layout: false,
      title : person.name || `Person ${req.params.id}`,
      person: person
    });
  } catch (error) {
    res.status(404).render('error', {
      message: 'Person not found',
      error  : { status: 404 }
    });
  }
});

module.exports = router;
