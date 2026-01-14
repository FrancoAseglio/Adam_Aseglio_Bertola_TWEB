const express = require('express');
const router = express.Router();

const MOCK_PROFILE_BASE = {
  "_id": "6964ffe0b353cfdb752a8638",
  "username": "CKK2",
  "gender": null,
  "birthday": null,
  "location": "United States",
  "joined": "Dec 1, 2018",
  "watching": 3,
  "completed": 182,
  "on_hold": 15,
  "dropped": 0,
  "plan_to_watch": 405,
  "userRatings": 605,
  "userFavorites": 0
};

router.get('/:username/full', (req, res) => {
  res.json({
    profile: MOCK_PROFILE_BASE,
    favorites: [
      {
        id: 21,
        fav_type: "anime",
        details: {
          title: "One Piece",
          image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
          score: 8.73
        }
      },
      {
        id: 40,
        fav_type: "character",
        details: {
          name: "Luffy Monkey D.",
          image_url: "https://cdn.myanimelist.net/images/characters/9/310307.jpg"
        }
      }
    ],
    ratings: [
      {
        anime_id: 40748,
        status: "completed",
        score: 9,
        animeDetails: {
          title: "Jujutsu Kaisen",
          image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
        }
      }
    ]
  });
});

router.get('/:username/stats', (req, res) => {
  res.json(MOCK_PROFILE_BASE);
});

router.put('/:username/preferences', (req, res) => {
  res.json({
    message: "Preferences updated successfully",
    updatedFields: req.body
  });
});

module.exports = router;
