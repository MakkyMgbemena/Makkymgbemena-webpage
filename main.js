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

const dropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

const closeAllDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');

    if (!toggle || !menu) return;

    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });
};

const toggleDropdown = (dropdown) => {
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');
  const menu = dropdown.querySelector('.nav-dropdown-menu');

  if (!toggle || !menu) return;

  const opening = menu.hidden;
  closeAllDropdowns();

  if (opening) {
    menu.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
  }
};

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('.nav-dropdown-toggle');

  if (!toggle) return;

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleDropdown(dropdown);
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-dropdown')) closeAllDropdowns();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeAllDropdowns();
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
  closeAllDropdowns();
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
  const BASE = 'https://us-central1-makkymgbemena-webpage.cloudfunctions.net';
  function youTubeEmbed(url){
    if(!url) return '';
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? 'https://www.youtube.com/embed/' + m[1] : '';
  }

  let videoSlides = [ { title: 'Your business here', src: '', sub: 'Ad rotation preview. Live spots opening soon' } ];

  const video = videoProjector.querySelector('.projector-video');
  const placeholder = videoProjector.querySelector('[data-video-placeholder]');
  const number = videoProjector.querySelector('[data-video-number]');
  const title = videoProjector.querySelector('[data-video-title]');
  const current = videoProjector.querySelector('[data-current-video]');
  const total = videoProjector.querySelector('[data-video-total]');
  const next = videoProjector.querySelector('[data-next-video]');
  const subEl = placeholder.querySelector('span:last-child');
  const placeholderHtml = placeholder.innerHTML;
  let currentSlide = 0;

  const renderVideoSlide = () => {
    const slide = videoSlides[currentSlide] || { title: 'Your business here', src: '', sub: '' };
    current.textContent = String(currentSlide + 1);
    if (total) total.textContent = String(videoSlides.length);
    number.textContent = 'Slot ' + String(currentSlide + 1).padStart(2, '0');
    title.textContent = slide.title;
    if (subEl && slide.sub) subEl.textContent = slide.sub;

    if (slide.youtube) {
      placeholder.innerHTML = '<iframe src="' + slide.youtube + '?autoplay=1&mute=1" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      placeholder.hidden = false; video.hidden = true;
      return;
    }
    if (slide.embed) {
      placeholder.style.backgroundImage = '';
      video.pause(); video.removeAttribute('src'); video.hidden = true; placeholder.hidden = false;
      placeholder.innerHTML = '<div style="position:absolute;inset:0;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;"><div id="projector-embed" style="transform-origin:center center;">' + (window.getEmbedHTML ? window.getEmbedHTML(slide.embed) : '') + '</div></div>';
      if (window.processEmbeds) window.processEmbeds();
      fitEmbedToScreen();
      return;
    }
    if (!placeholder.querySelector('[data-video-title]')) placeholder.innerHTML = placeholderHtml;

    if (slide.image) {
      placeholder.style.backgroundImage = 'url(' + slide.image + ')';
      placeholder.style.backgroundSize = 'cover';
      placeholder.style.backgroundPosition = 'center';
      video.hidden = true; placeholder.hidden = false;
    } else if (slide.src) {
      placeholder.style.backgroundImage = '';
      video.src = slide.src; video.hidden = false; placeholder.hidden = true; video.muted = true; video.playsInline = true; video.autoplay = true; video.loop = true; video.preload = 'auto'; video.load(); video.play().catch(function(){});
    } else {
      placeholder.style.backgroundImage = '';
      video.pause(); video.removeAttribute('src'); video.hidden = true; placeholder.hidden = false;
    }
  };

  function fitEmbedToScreen(){
    var screen = videoProjector.querySelector('.projector-screen');
    var box = placeholder.querySelector('#projector-embed');
    if(!screen || !box) return;
    var tries = 0;
    function run(){
      var child = box.querySelector('iframe') || box.firstElementChild;
      var ew = child ? child.offsetWidth : 0;
      var eh = child ? child.offsetHeight : 0;
      if(!eh || eh < 40){ if(tries < 24){ tries++; setTimeout(run, 250); } return; }
      var cw = screen.clientWidth || 1, ch = screen.clientHeight || 1;
      var s = Math.min(cw / ew, ch / eh, 1);
      box.style.width = ew + 'px'; box.style.height = eh + 'px';
      box.style.transform = 'scale(' + s + ')';
    }
    run();
    window.addEventListener('resize', function(){ setTimeout(run, 60); });
  }

  next.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % videoSlides.length;
    renderVideoSlide();
  });

  fetch(BASE + '/getActiveAds', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{}'})
    .then(function(r){ return r.json(); })
    .then(function(d){
      const ads = (d.ads || []).filter(function(a){ return a.status === 'approved'; });
      if (ads.length) {
                videoSlides = ads.map(function(a){
          var mediaUrl = a.videoUrl || a.imageUrl || '';
          var yt = youTubeEmbed(mediaUrl);
          var isImage = /\.(png|jpe?g|webp|gif)(\?|$)/i.test(a.imageUrl || '');
          var isVideo = /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(mediaUrl);
          var isEmbed = !yt && !isImage && !isVideo;
          return { title: a.business || 'Your business here', sub: (mediaUrl || a.email || ''), image: isImage ? a.imageUrl : '', src: (!isImage && !yt && isVideo) ? mediaUrl : '', youtube: yt, embed: isEmbed ? mediaUrl : '' };
        });
        currentSlide = 0;
      }
      renderVideoSlide();
    })
    .catch(function(){ renderVideoSlide(); });

  renderVideoSlide();
}
