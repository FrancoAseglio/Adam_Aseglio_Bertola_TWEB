async function getUserRatings() {
  const username = document.getElementById('ratingUsername').value;
  if (!username) return alert('Please enter a username');
  window.location.href = `/ratings/${encodeURIComponent(username)}`;
}