const express = require('express');
const router  = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: MongoDB Backend Landing Page
 *     tags: [Backend]
 *     responses:
 *       200:
 *         description: Successfully rendered the MongoDB backend template
 *       500:
 *         description: Server error
 */
router.get('/', function(req, res) {
  res.render('index', {
    pageTitle  : "MongoDB Backend",
    heading    : "🍃 Express MongoDB Backend",
    message    : "This is the project's MongoDB backend server. You aren't supposed to be here.",
    frontendUrl: "http://localhost:3000",
    linkText   : "Go to Frontend"
  });
});

module.exports = router;
