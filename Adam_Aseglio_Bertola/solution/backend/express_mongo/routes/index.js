const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MongoDB Backend</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        h1 { color: #333; }
        p { color: #666; }
        a { color: #007bff; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>🍃 Express MongoDB Backend</h1>
      <p>Questo è il server backend MongoDB del progetto. Non dovresti essere qui.</p>
      <p><a href="http://localhost:3000">→ Vai al Frontend (localhost:3000)</a></p>
    </body>
    </html>
  `);
});

module.exports = router;
