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

const servicesToggle = document.querySelector('.nav-dropdown-toggle');
const servicesMenu = document.querySelector('.nav-dropdown-menu');

const closeServicesMenu = () => {
  servicesMenu.hidden = true;
  servicesToggle.setAttribute('aria-expanded', 'false');
};

servicesToggle.addEventListener('click', () => {
  const opening = servicesMenu.hidden;
  servicesMenu.hidden = !opening;
  servicesToggle.setAttribute('aria-expanded', String(opening));
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-dropdown')) closeServicesMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeServicesMenu();
});

const clearVisibleHash = () => {
  if (window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
};

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link) return;

  const hash = link.getAttribute('href');
  const target = hash === '#home' ? document.body : document.querySelector(hash);
  if (!target) {
    event.preventDefault();
    clearVisibleHash();
    return;
  }

  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  closeServicesMenu();
  clearVisibleHash();
});

if (window.location.hash) {
  const initialTarget = document.querySelector(window.location.hash);
  if (initialTarget) {
    requestAnimationFrame(() => initialTarget.scrollIntoView({ block: 'start' }));
  }
  clearVisibleHash();
}
const videoProjector = document.querySelector('[data-video-projector]');

if (videoProjector) {
  const videoSlides = [
    { title: 'Website build overview', src: '' },
    { title: 'Dashboard and reporting overview', src: '' },
    { title: 'Business automation overview', src: '' },
    { title: 'Search visibility overview', src: '' },
    { title: 'Business setup overview', src: '' }
  ];

  const video = videoProjector.querySelector('.projector-video');
  const placeholder = videoProjector.querySelector('[data-video-placeholder]');
  const number = videoProjector.querySelector('[data-video-number]');
  const title = videoProjector.querySelector('[data-video-title]');
  const current = videoProjector.querySelector('[data-current-video]');
  const next = videoProjector.querySelector('[data-next-video]');
  let currentSlide = 0;

  const renderVideoSlide = () => {
    const slide = videoSlides[currentSlide];
    current.textContent = String(currentSlide + 1);
    number.textContent = `Video ${String(currentSlide + 1).padStart(2, '0')}`;
    title.textContent = slide.title;

    if (slide.src) {
      video.src = slide.src;
      video.hidden = false;
      placeholder.hidden = true;
      video.load();
    } else {
      video.pause();
      video.removeAttribute('src');
      video.hidden = true;
      placeholder.hidden = false;
    }
  };

  next.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % videoSlides.length;
    renderVideoSlide();
  });

  renderVideoSlide();
}
