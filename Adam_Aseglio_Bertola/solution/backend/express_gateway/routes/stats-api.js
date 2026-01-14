const express = require('express');
const router = express.Router();


const RAW_GLOBAL_STATS = {
  totalProfiles: 335476,
  totalRatings: 124298350,
  totalFavorites: 4178743,
  totalAnime: 15284,
  calculatedAt: "2026-01-13T20:35:01.912Z"
};

const RAW_USER_STATS = {
  username: "CKK2",
  totalRatings: 605,
  totalFavorites: 0,
  averageScore: "2.28",
  statusCounts: {
    watching: 3,
    completed: 182,
    on_hold: 15,
    dropped: 0,
    plan_to_watch: 405
  },
  profileData: {
    _id: "6964ffe0b353cfdb752a8638",
    username: "CKK2",
    gender: null,
    birthday: null,
    location: "United States",
    joined: "Dec 1, 2018",
    watching: 3,
    completed: 182,
    on_hold: 15,
    dropped: 0,
    plan_to_watch: 405
  },
  calculatedAt: "2026-01-13T20:35:09.488Z"
};

const RAW_ANIME_STATS = {
  _id: "6964ffdfb353cfdb7528c09b",
  mal_id: 21,
  watching: 1838015,
  completed: 14,
  on_hold: 308583,
  dropped: 206070,
  plan_to_watch: 228928,
  total: 2581610,
  score_1_votes: 14452,
  score_1_percentage: 1,
  score_2_votes: 4425,
  score_2_percentage: 0.3,
  score_3_votes: 6109,
  score_3_percentage: 0.4,
  score_4_votes: 12921,
  score_4_percentage: 0.9,
  score_5_votes: 29333,
  score_5_percentage: 2,
  score_6_votes: 55320,
  score_6_percentage: 3.8,
  score_7_votes: 134818,
  score_7_percentage: 9.2,
  score_8_votes: 235583,
  score_8_percentage: 16,
  score_9_votes: 302923,
  score_9_percentage: 20.6,
  score_10_votes: 673409,
  score_10_percentage: 45.8
};


router.get('/global', (req, res) => {
  res.json(RAW_GLOBAL_STATS);
});

router.get('/user/:username', (req, res) => {
  res.json({
    ...RAW_USER_STATS,
    username: req.params.username
  });
});

router.get('/anime/:animeId', (req, res) => {
  res.json({
    stats: RAW_ANIME_STATS,
    animeDetails: {
      mal_id: parseInt(req.params.animeId),
      title: "One Piece",
      image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
      status: "Currently Airing",
      type: "TV"
    }
  });
});

module.exports = router;
