(() => {
  const slider = document.querySelector("[data-preview-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-preview-track]");
  const next = slider.querySelector("[data-preview-next]");
  const previous = slider.querySelector("[data-preview-prev]");
  const lines = [...slider.querySelectorAll("[data-preview-go]")];
  const items = [...slider.querySelectorAll(".carousel-item")];
  const explore = slider.querySelector('.abs-button-primary');

  let active = 0;
  let touchStartX = 0;
  let wheelTotal = 0;
  let wheelTimer;
  let wheelLocked = false;

  // Active state synchronization logic
  const show = (index) => {
    // Limits the active slide bounds between 0 and 2 (Slide 1, 2, or 3)
    active = Math.max(0, Math.min(2, index));
    slider.dataset.activeSlide = String(active);

    // Bootstrap Class active state sync
    items.forEach((item, i) => {
      if (i === active) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Custom Line Indicators active state sync
    lines.forEach((line, i) => {
      if (i === active) {
        line.classList.add("is-active");
        line.setAttribute("aria-current", "true");
      } else {
        line.classList.remove("is-active");
        line.removeAttribute("aria-current");
      }
    });

    // Disable arrows at boundary slide limits
    if (previous) previous.disabled = (active === 0);
    if (next) next.disabled = (active === 2);
  };

  // Click navigation triggers
  if (next) {
    next.addEventListener("click", () => show(active + 1));
  }
  if (previous) {
    previous.addEventListener("click", () => show(active - 1));
  }
  if (explore) {
    explore.addEventListener("click", (event) => {
      event.preventDefault();
      show(1); // Navigates to Slide 2 (Technical Capabilities Grid)
    });
  }

  lines.forEach((line) => {
    line.addEventListener("click", () => {
      show(Number(line.dataset.previewGo));
    });
  });

  // Mobile Touch Swipe gesture detection
  track.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches.clientX;
  }, { passive: true });

  track.addEventListener("touchend", (event) => {
    const distance = event.changedTouches.clientX - touchStartX;
    const threshold = 55; // Trigger threshold in pixels
    
    if (distance < -threshold) {
      show(active + 1); // Swipe left -> next slide
    } else if (distance > threshold) {
      show(active - 1); // Swipe right -> previous slide
    }
  }, { passive: true });

  // Trackpad Horizontal Scroll detection
  slider.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 4) {
      return;
    }
    
    // Prevent browser forward/back navigate behaviors on trackpad swipe
    event.preventDefault();

    if (wheelLocked) return;

    wheelTotal += event.deltaX;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      if (wheelTotal > 45) {
        show(active + 1); // Scroll trackpad right -> next slide
        lockWheel();
      } else if (wheelTotal < -45) {
        show(active - 1); // Scroll trackpad left -> previous slide
        lockWheel();
      }
      wheelTotal = 0;
    }, 45);
  }, { passive: false });

  const lockWheel = () => {
    wheelLocked = true;
    setTimeout(() => { wheelLocked = false; }, 600); // Prevents infinite trackpad slide loops
  };

  // Initialize
  show(0);
})();