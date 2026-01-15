async function searchAnime() {
  const query = value('searchQuery');
  if (!query) return alert('Please enter a search query');

  // Redirect to the dedicated anime search page
  window.location.href = `/anime/search?title=${encodeURIComponent(query)}`;
}