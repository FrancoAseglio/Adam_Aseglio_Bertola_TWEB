const express = require('express');
const router = express.Router();

const MOCK_CHARACTERS = [
  {
    characterMalId: 40,
    name: "Luffy Monkey D.",
    nameKanji: "モンキー・D・ルフィ",
    image_url: "https://cdn.myanimelist.net/images/characters/9/310307.jpg",
    favorites: 145750,
    nicknames: null,
    about: "Age: 17; 19\nBirthdate: May 5, Taurus... Luffy's dream is to find the One Piece and become Pirate King."
  },
  {
    characterMalId: 1,
    name: "Spike Spiegel",
    nameKanji: "スパイク・スピーゲル",
    image_url: "https://cdn.myanimelist.net/images/characters/11/516853.jpg",
    favorites: 48344,
    nicknames: null,
    about: "Birthdate: June 26, 2044\nHeight: 185 cm... Spike Spiegel is a tall and lean 27-year-old bounty hunter."
  }
];

router.get('/search', (req, res) => {
  const nameQuery = req.query.name?.toLowerCase() || '';
  const results = MOCK_CHARACTERS.filter(c =>
    c.name.toLowerCase().includes(nameQuery)
  );
  res.json(results.length > 0 ? results : [MOCK_CHARACTERS[0]]);
});

router.get('/:id', (req, res) => {
  const character = MOCK_CHARACTERS.find(c => c.characterMalId == req.params.id);
  if (character) res.json(character);
  else res.json(MOCK_CHARACTERS[1]);
});

router.post('/', (req, res) => {
  const newCharacter = {
    ...req.body,
    characterMalId: Math.floor(Math.random() * 1000000),
    favorites: 0,
    nicknames: null
  };
  res.status(201).json(newCharacter);
});

router.delete('/:id', (req, res) => {
  res.json({
    message: `Character with ID ${req.params.id} removed successfully`,
    success: true
  });
});

module.exports = router;
