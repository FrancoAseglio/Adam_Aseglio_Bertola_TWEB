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
    interval: false, // Disable default auto-play
    ride: false
  });
  
  let autoPlayTimer;
  const AUTO_PLAY_INTERVAL = 5000; // 5 secondi per auto-play
  let isAutoSliding = false; // Flag per distinguere auto-play da click manuale
  
  // Funzione per avviare l'auto-play
  function startAutoPlay() {
    clearTimeout(autoPlayTimer);
    autoPlayTimer = setTimeout(() => {
      isAutoSliding = true;
      bsCarousel.next();
      isAutoSliding = false;
      startAutoPlay(); // Ricomincia il timer dopo lo slide
    }, AUTO_PLAY_INTERVAL);
  }
  
  // Event listener per interazioni manuali (click su frecce)
  carousel.addEventListener('slide.bs.carousel', function(event) {
    // Resetta il timer SOLO se è un click manuale (non auto-play)
    if (!isAutoSliding) {
      clearTimeout(autoPlayTimer);
      startAutoPlay();
    }
  });
  
  // Avvia l'auto-play iniziale
  startAutoPlay();
}

/**
 * Initialize the page on load
 */
function init() {
  console.log('Anime Data System initialized');
  const resultsEl = document.getElementById('results');
  if (resultsEl) resultsEl.style.display = 'none';
  
  // Inizializza il carosello delle statistiche
  initStatsCarousel();
}

/**
 * Load and display specific section (anime, user)
 * Automatically scrolls to the newly displayed section
 * @param {string} section - The section to display
 */
function loadSection(section) {
  document.querySelectorAll('[id$="-section"]').forEach(el => el.style.display = 'none');
  const sectionElement = document.getElementById(section + '-section');
  sectionElement.style.display = 'flex';
  clearResults();

  // Smooth scroll to the newly displayed section
  setTimeout(() => {
    sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
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

