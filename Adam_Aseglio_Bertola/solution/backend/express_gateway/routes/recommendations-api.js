const express = require('express');
const router = express.Router();

const MOCK_ENRICHED_DATA = [
  {
    recommendation_mal_id: 51009,
    title: "Jujutsu Kaisen 2nd Season",
    score: 8.73,
    image_url: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
    synopsis: "The year is 2006, and the halls of Tokyo Prefectural Jujutsu High School echo...",
    status: "Finished Airing",
    genres: "['Action', 'Supernatural']",
    type: "TV",
    episodes: 23,
    studios: "['MAPPA']"
  }
];

router.get('/:malId', (req, res) => {
  res.status(200).json(MOCK_ENRICHED_DATA);
});

module.exports = router;
