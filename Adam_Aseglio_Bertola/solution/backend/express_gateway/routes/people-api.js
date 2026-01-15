const express = require('express');
const router = express.Router();

const MOCK_PERSON_DATA = {
  mal_id: 1,
  name: "Tomokazu Sugita",
  given_name: "智和",
  family_name: "杉田",
  birthday: "1980-10-11T00:00:00+00:00",
  website_url: null,
  image_url: "https://cdn.myanimelist.net/images/voiceactors/3/54687.jpg",
  favorites: 85203,
  about: "Tomokazu Sugita is a Japanese voice actor and author who is most well-known for his role as Gintoki Sakata in Gintama.",
  alternate_names: "['Sugita Tomokazu']"
};

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    ...MOCK_PERSON_DATA,
    mal_id: parseInt(id) || id
  });
});

module.exports = router;
