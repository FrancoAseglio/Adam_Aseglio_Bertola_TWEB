const express = require('express');
const router = express.Router();

const MOCK_RATINGS_WITH_DETAILS = [
  {
    _id: "6964fff7b353cfdb756f6bb2",
    username: "CKK2",
    anime_id: 31764,
    status: "plan_to_watch",
    score: 0,
    is_rewatching: 0,
    num_watched_episodes: 0,
    animeDetails: {
      title: "Nejimaki Seirei Senki: Tenkyou no Alderamin",
      image_url: "https://cdn.myanimelist.net/images/anime/3/80145.jpg",
      type: "TV",
      status: "Finished Airing",
      genres: "['Action', 'Adventure', 'Fantasy']",
      score: 7.68
    }
  },
  {
    _id: "6964fff7b353cfdb756f6bb3",
    username: "CKK2",
    anime_id: 22147,
    status: "completed",
    score: 8,
    is_rewatching: 0,
    num_watched_episodes: 12,
    animeDetails: {
      title: "Amagi Brilliant Park",
      image_url: "https://cdn.myanimelist.net/images/anime/10/67157.jpg",
      type: "TV",
      status: "Finished Airing",
      genres: "['Comedy', 'Fantasy']",
      score: 7.48
    }
  }
];

router.get('/:username', (req, res) => {
  res.json(MOCK_RATINGS_WITH_DETAILS);
});

module.exports = router;
