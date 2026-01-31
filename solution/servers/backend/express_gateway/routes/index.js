const express = require('express');
const router  = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Gateway Landing Page
 *     tags: [Gateway]
 *     responses:
 *       200:
 *         description: Successfully rendered the gateway template
 *       500:
 *         description: Server error
 */
router.get('/', function(req, res) {
  res.render('index', {
    pageTitle  : "Gateway Server",
    heading    : "🚪 Express Gateway / Middleware",
    message    : "This is the project's gateway server. You aren't supposed to be here.",
    frontendUrl: "http://localhost:3000",
    linkText   : "Go to Frontend"
  });
});

module.exports = router;
