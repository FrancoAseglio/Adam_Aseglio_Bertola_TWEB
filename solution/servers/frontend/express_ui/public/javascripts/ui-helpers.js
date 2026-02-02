/**
 * UI Helper Functions
 */

/**
 * Search and view user profile
 * @param {Event} event - The form submit event
 */
function searchProfile(event) {
  event.preventDefault();
  const username = document.getElementById('usernameSearch').value.trim();
  if (username) window.location.href = `/profile/${encodeURIComponent(username)}`;
}

/**
 * Initialize the stats carousel with auto-play and timer reset
 */
function initStatsCarousel() {
  const carousel = document.getElementById('statsCarousel');
  if (!carousel) return;
  
  const bsCarousel = new bootstrap.Carousel(carousel, {
    interval: false,
    ride: false
  });
  
  let autoPlayTimer;
  const AUTO_PLAY_INTERVAL = 5000;
  let isAutoSliding = false;
  
  function startAutoPlay() {
    clearTimeout(autoPlayTimer);
    autoPlayTimer = setTimeout(() => {
      isAutoSliding = true;
      bsCarousel.next();
      isAutoSliding = false;
      startAutoPlay();
    }, AUTO_PLAY_INTERVAL);
  }
  
  carousel.addEventListener('slide.bs.carousel', function(event) {
    if (!isAutoSliding) {
      clearTimeout(autoPlayTimer);
      startAutoPlay();
    }
  });
  
  startAutoPlay();
}

/**
 * Initialize the page on load
 */
function init() {
  console.log('Anime Data System initialized');
  const resultsEl = document.getElementById('results');
  if (resultsEl) resultsEl.style.display = 'none';
  
  initStatsCarousel();
}

/**
 * Show result in the results div
 * @param {Object} data - The data to display
 */
function showResult(data) {
  document.getElementById('results').style.display = 'block';
  document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Clear and hide the results div
 */
function clearResults() {
  document.getElementById('results').style.display = 'none';
}

