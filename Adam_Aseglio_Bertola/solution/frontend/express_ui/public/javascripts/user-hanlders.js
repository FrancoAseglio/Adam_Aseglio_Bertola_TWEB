async function getUserProfile() {
  const username = document.getElementById('profileUsername').value;
  if (!username) return alert('Please enter a username');
  window.location.href = `/profile/${encodeURIComponent(username)}`;
}

async function getUserFavorites() {
  const username = document.getElementById('favUsername').value;
  if (!username) return alert('Please enter a username');
  window.location.href = `/favorites/${encodeURIComponent(username)}`;
}

async function getUserRatings() {
  const username = document.getElementById('ratingUsername').value;
  if (!username) return alert('Please enter a username');
  window.location.href = `/ratings/${encodeURIComponent(username)}`;
}

async function getUserStats() {
  const username = document.getElementById('statsUsername').value;
  if (!username) return alert('Please enter a username');
  window.location.href = `/stats/user/${encodeURIComponent(username)}`;
}

async function getAnimeRecommendations() {
  const malId = document.getElementById('recommendationMalId').value;
  if (!malId) return alert('Please enter an anime ID');
  window.location.href = `/recommendations/${encodeURIComponent(malId)}`;
}

async function getAnimeStatistics() {
  const animeId = document.getElementById('animeStatsId').value;
  if (!animeId) return alert('Please enter an anime ID');
  window.location.href = `/stats/anime/${encodeURIComponent(animeId)}`;
}