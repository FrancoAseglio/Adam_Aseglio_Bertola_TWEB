/**
 * Anime-Specific API Handler Functions
 *
 * This module contains all anime-related API operations including:
 * - Searching and browsing anime
 * - Fetching anime details and statistics
 * - Getting ratings
 * - Filtering by genre
 *
 * Dependencies:
 * - api-handlers.js (for api, handle, resolveAnimeId, value, animeAction)
 * - ui-helpers.js (for showResult)
 */

/**
 * Search for anime by title
 * Reads from: searchQuery input field
 * Redirects to: /anime/search?title=query
 * @returns {void} Redirects to search page
 */
async function searchAnime() {
  const query = value('searchQuery');
  if (!query) return alert('Please enter a search query');
  window.location.href = `/anime/search?title=${encodeURIComponent(query)}`;
}

/**
 * Get detailed information for a specific anime by title
 * Reads from: animeId input field
 * Redirects to: /anime/search?title=query
 * @returns {void} Redirects to search page
 */
async function getAnimeDetails() {
  const input = value('animeId');
  if (!input) return alert('Please enter an anime title');
  window.location.href = `/anime/search?title=${encodeURIComponent(input)}`;
}

/**
 * Get anime filtered by genre
 * Reads from: genreInput input field
 * Endpoint: GET /api/anime/genre/:genre?limit=20
 * @returns {Promise<void>} Redirects to genre search page
 */
async function getAnimeByGenre() {
  const genre = value('genreInput');
  if (!genre) return alert('Please enter a genre');
  window.location.href = `/anime/genre/${encodeURIComponent(genre)}`;
}

/**
 * Search for character by name
 * Reads from: characterSearchQuery input field
 * Redirects to: /characters/search?name=query
 * @returns {void} Redirects to character search page
 */
async function searchCharacter() {
  const query = value('characterSearchQuery');
  if (!query) return alert('Please enter a character name');
  window.location.href = `/characters/search?name=${encodeURIComponent(query)}`;
}

/**
 * Get detailed information for a specific character by ID
 * Reads from: characterId input field
 * Redirects to: /characters/:id
 * @returns {void} Redirects to character detail page
 */
async function getCharacterDetail() {
  const id = value('characterId');
  if (!id) return alert('Please enter a character ID');
  window.location.href = `/characters/${encodeURIComponent(id)}`;
}

// ============================================================================
// VIEW-SPECIFIC EVENT HANDLERS
// ============================================================================

/**
 * Initialize anime search page functionality
 * Sets up genre dropdown management and clickable anime cards
 */
document.addEventListener('DOMContentLoaded', function() {
  // GENRE DROPDOWN MANAGEMENT (anime-search.hbs)
  const genreCheckboxes = document.querySelectorAll('.genre-checkbox');
  const genreButton = document.querySelector('.genre-dropdown-toggle');
  const genreInputsContainer = document.getElementById('genreInputsContainer');

  if (genreCheckboxes.length > 0 && genreButton) {
    // Update display whenever checkboxes change
    function updateGenreDisplay() {
      const checkedBoxes = Array.from(genreCheckboxes).filter(cb => cb.checked);
      const checkedCount = checkedBoxes.length;
      
      // Update button text
      if (checkedCount === 0) {
        genreButton.textContent = 'Select Genres...';
      } else if (checkedCount === 1) {
        genreButton.textContent = checkedBoxes[0].nextElementSibling.textContent.trim();
      } else {
        genreButton.textContent = `${checkedCount} genres selected`;
      }
      
      // Update hidden inputs for form submission
      if (genreInputsContainer) {
        genreInputsContainer.innerHTML = '';
        checkedBoxes.forEach(cb => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'genres[]';
          input.value = cb.value;
          genreInputsContainer.appendChild(input);
        });
      }
      
      // Update badge display
      document.querySelectorAll('.genre-badge').forEach(badge => badge.remove());
      
      if (checkedCount > 0) {
        const badgeContainer = document.createElement('div');
        badgeContainer.className = 'mt-2';
        checkedBoxes.forEach(cb => {
          const badge = document.createElement('span');
          badge.className = 'badge bg-primary me-1 genre-badge';
          badge.textContent = cb.nextElementSibling.textContent.trim();
          badgeContainer.appendChild(badge);
        });
        genreButton.parentElement.appendChild(badgeContainer);
      }
      
      // Visual feedback for checked items
      genreCheckboxes.forEach(cb => {
        const label = cb.closest('label');
        if (cb.checked) {
          label.style.backgroundColor = '#d1f4e0';
          label.style.fontWeight = 'bold';
        } else {
          label.style.backgroundColor = '';
          label.style.fontWeight = '';
        }
      });
    }
    
    // Add change listeners to all checkboxes
    genreCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', updateGenreDisplay);
    });
    
    // Prevent dropdown from closing when clicking checkboxes
    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    });
    
    // Initialize display
    updateGenreDisplay();
  }

  // CLICKABLE ANIME CARDS (anime-search.hbs, anime-genre.hbs)
  document.querySelectorAll('.anime-card[data-anime-id]').forEach(card => {
    card.addEventListener('click', function() {
      const animeId = this.getAttribute('data-anime-id');
      if (animeId) {
        window.location.href = `/anime/${animeId}`;
      }
    });
  });

  // CLICKABLE CHARACTER CARDS (anime-detail.hbs)
  document.querySelectorAll('[data-character-id]').forEach(card => {
    card.addEventListener('click', function() {
      const characterId = this.getAttribute('data-character-id');
      if (characterId) {
        window.location.href = `/characters/${characterId}`;
      }
    });
  });

  // CLICKABLE PEOPLE CARDS (anime-detail.hbs)
  document.querySelectorAll('[data-person-id]').forEach(card => {
    card.addEventListener('click', function() {
      const personId = this.getAttribute('data-person-id');
      if (personId) {
        window.location.href = `/people/${personId}`;
      }
    });
  });

  // CLICKABLE STATS CARD (anime-detail.hbs)
  const statsCard = document.querySelector('[data-anime-stats-id]');
  if (statsCard) {
    statsCard.addEventListener('click', function() {
      const animeId = this.getAttribute('data-anime-stats-id');
      if (animeId) {
        window.location.href = `/anime/stats/${animeId}`;
      }
    });
  }
});
