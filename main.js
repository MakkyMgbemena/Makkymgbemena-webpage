'use strict';

const searchButton = document.querySelector('.search-button');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('#site-search');
const searchForm = document.querySelector('.search-form');

searchButton.setAttribute('aria-controls', 'search-panel');
searchButton.setAttribute('aria-expanded', 'false');

searchButton.addEventListener('click', () => {
  const opening = searchPanel.hidden;
  searchPanel.hidden = !opening;
  searchButton.setAttribute('aria-expanded', String(opening));
  searchButton.setAttribute('aria-label', opening ? 'Close search' : 'Search');
  if (opening) searchInput.focus();
});

searchForm.addEventListener('submit', (event) => event.preventDefault());
