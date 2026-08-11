
(() => {
  const slider = document.querySelector("[data-preview-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-preview-track]");
  const next = slider.querySelector("[data-preview-next]");
  const previous = slider.querySelector("[data-preview-prev]");
  const lines = [...slider.querySelectorAll("[data-preview-go]")];
  const explore = slider.querySelector(
    '.abs-button-primary[href="#ap-processor"]'
  );

  let active = 0;
  let touchStartX = 0;
  let wheelTotal = 0;
  let wheelTimer;
  let wheelLocked = false;

  const show = (index) => {
    active = Math.max(0, Math.min(1, index));
    slider.dataset.activeSlide = String(active);

    previous.disabled = active === 0;
    next.disabled = active === 1;

    lines.forEach((line, lineIndex) => {
      line.classList.toggle("is-active", lineIndex === active);
    });
  };

  next.addEventListener("click", () => show(1));
  previous.addEventListener("click", () => show(0));

  if (explore) {
    explore.addEventListener("click", (event) => {
      event.preventDefault();
      show(1);
    });
  }

  lines.forEach((line) => {
    line.addEventListener("click", () => {
      show(Number(line.dataset.previewGo));
    });
  });

  track.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (event) => {
    const distance =
      event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(distance) >= 45) {
      show(distance < 0 ? 1 : 0);
    }
  }, { passive: true });

  slider.addEventListener("wheel", (event) => {
    if (
      Math.abs(event.deltaX) <= Math.abs(event.deltaY) ||
      Math.abs(event.deltaX) < 2
    ) return;

    const canMove =
      (event.deltaX > 0 && active === 0) ||
      (event.deltaX < 0 && active === 1);

    if (!canMove) return;

    event.preventDefault();
    clearTimeout(wheelTimer);
    wheelTotal += event.deltaX;

    wheelTimer = setTimeout(() => {
      wheelTotal = 0;
    }, 160);

    if (wheelLocked || Math.abs(wheelTotal) < 45) return;

    wheelLocked = true;
    show(wheelTotal > 0 ? 1 : 0);
    wheelTotal = 0;

    setTimeout(() => {
      wheelLocked = false;
    }, 700);
  }, { passive: false });

  show(0);
})();
