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