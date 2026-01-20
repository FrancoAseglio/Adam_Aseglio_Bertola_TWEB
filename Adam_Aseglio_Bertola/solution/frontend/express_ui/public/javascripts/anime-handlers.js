async function searchAnime() {
  const query = document.getElementById('searchQuery').value;
  if (!query) return alert('Please enter a search query');

  // Redirect to the dedicated anime search page
  window.location.href = `/anime/search?title=${encodeURIComponent(query)}`;
}

async function getAnimeDetail() {
  const animeId = document.getElementById('animeId').value;
  if (!animeId) return alert('Please enter an anime ID');

  // Redirect to anime detail page
  window.location.href = `/anime/${encodeURIComponent(animeId)}`;
}

async function searchCharacter() {
  const query = document.getElementById('searchCharacterQuery').value;
  if (!query) return alert('Please enter a character name');

  // Redirect to the dedicated character search page
  window.location.href = `/characters/search?name=${encodeURIComponent(query)}`;
}