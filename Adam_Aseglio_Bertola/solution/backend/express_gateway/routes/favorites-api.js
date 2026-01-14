const express = require('express');
const router = express.Router();

const MOCK_FAVORITE_ITEM = {
  _id: "6964fff7b353cfdb756f6cc5",
  username: "CKK2",
  id: 40748, // Jujutsu Kaisen
  details: {
    mal_id: 40748,
    title: "Jujutsu Kaisen",
    image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    score: 8.53,
    type: "TV",
    status: "Finished Airing"
  }
};

router.get('/:username', (req, res) => {
  // Change this to [MOCK_FAVORITE_ITEM] if you want to test the UI with data.
  res.json([]); 
});

router.post('/', (req, res) => {
  const { username, id } = req.body;
  
  res.status(201).json({
    _id: "mock_" + Math.random().toString(16).slice(2, 10),
    username: username,
    id: id,
    details: {
      mal_id: id,
      title: "Newly Added Favorite",
      image_url: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
      score: 8.73,
      type: "TV",
      status: "Finished Airing"
    }
  });
});

router.delete('/:username/:id', (req, res) => {
  res.json({ message: 'Favorite removed successfully' });
});

module.exports = router;
