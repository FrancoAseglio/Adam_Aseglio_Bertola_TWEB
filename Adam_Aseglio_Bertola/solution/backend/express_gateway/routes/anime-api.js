const express = require('express');
const router = express.Router();

const MOCK_JUJUTSU_LIST = [
  {
    mal_id: 40748,
    title: "Jujutsu Kaisen",
    score: 8.53,
    image_url: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg",
    status: "Finished Airing",
    type: "TV",
    genres: "['Action', 'Award Winning', 'Supernatural']",
    synopsis: "Idly indulging in baseless paranormal activities with the Occult Club...",
    studios: "['MAPPA']"
  },
  {
    mal_id: 48561,
    title: "Jujutsu Kaisen 0 Movie",
    score: 8.39,
    image_url: "https://cdn.myanimelist.net/images/anime/1121/119044.jpg",
    status: "Finished Airing",
    type: "Movie",
    genres: "['Action', 'Supernatural']",
    synopsis: "Violent misfortunes frequently occur around 16-year-old Yuuta Okkotsu..."
  }
];

const MOCK_TOP_ANIME = [
  {
    mal_id: 52991,
    title: "Sousou no Frieren",
    score: 9.29,
    image_url: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
    status: "Finished Airing",
    type: "TV",
    rank: 1,
    genres: "['Adventure', 'Drama', 'Fantasy']",
    synopsis: "During their decade-long quest to defeat the Demon King..."
  }
];

router.get('/search', (req, res) => {
  const title = req.query.title?.toLowerCase() || '';
  if (title.includes('jujutsu')) return res.json(MOCK_JUJUTSU_LIST);
  res.json([...MOCK_TOP_ANIME, ...MOCK_JUJUTSU_LIST]);
});

router.get('/top/all', (req, res) => {
  res.json(MOCK_TOP_ANIME);
});

router.get('/genre/:genre', (req, res) => {
  if (req.params.genre.toLowerCase() === 'fantasy') return res.json(MOCK_TOP_ANIME);
  res.json(MOCK_JUJUTSU_LIST);
});

router.get('/', (req, res) => {
  const size = parseInt(req.query.size) || 20;
  const page = parseInt(req.query.page) || 0;

  res.json({
    content: [...MOCK_TOP_ANIME, ...MOCK_JUJUTSU_LIST],
    totalPages: 1,
    totalElements: 3,
    last: true,
    size: size,
    number: page
  });
});

router.get(['/:id', '/mongo/:id'], (req, res) => {
  const allAnime = [...MOCK_TOP_ANIME, ...MOCK_JUJUTSU_LIST];
  const anime = allAnime.find(a => a.mal_id == req.params.id) || allAnime[0];
  res.json(anime);
});

module.exports = router;
