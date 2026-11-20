// Animate the photographed airflow itself, with a feathered displacement mask.
(() => {
  const canvas = document.querySelector('.photo-wind');
  const photo = document.querySelector('.hero-art > img');
  const ctx = canvas.getContext('2d');
  const region = { x: 400, y: 368, w: 700, h: 220 };
  const layer = document.createElement('canvas');
  const mask = document.createElement('canvas');
  layer.width = mask.width = region.w;
  layer.height = mask.height = region.h;
  const paint = layer.getContext('2d');
  const feather = mask.getContext('2d');
  feather.filter = 'blur(14px)';
  feather.fillStyle = '#fff';
  feather.beginPath();
  feather.moveTo(265, 12);
  feather.lineTo(650, 12);
  feather.bezierCurveTo(560, 95, 470, 165, 320, 190);
  feather.lineTo(30, 190);
  feather.bezierCurveTo(130, 135, 225, 55, 265, 12);
  feather.fill();
  // Fade at the vent so its hard edge and the appliance never move.
  feather.filter = 'none';
  feather.globalCompositeOperation = 'destination-in';
  const fade = feather.createLinearGradient(0, 0, 0, region.h);
  fade.addColorStop(0, 'transparent');
  fade.addColorStop(.17, '#fff');
  fade.addColorStop(.68, '#fff');
  fade.addColorStop(1, 'transparent');
  feather.fillStyle = fade;
  feather.fillRect(0, 0, region.w, region.h);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true, last = 0, time = 0, frame = 0;
  const running = () => visible && !document.hidden && !reduced.matches && !document.body.classList.contains('paused');
  function render(now) {
    frame = 0;
    if (!running()) { last = 0; return; }
    if (last && now - last < 32) { frame = requestAnimationFrame(render); return; }
    time += last ? Math.min(now - last, 60) / 1000 : 0;
    last = now;
    paint.clearRect(0, 0, region.w, region.h);
    paint.globalCompositeOperation = 'source-over';
    for (let y = 0; y < region.h; y += 2) {
      const strength = Math.sin(Math.PI * y / region.h);
      const wave = y / 40 - time * 2.6;
      const dx = strength * (9 * Math.sin(wave) + 3 * Math.sin(wave * 1.7));
      const dy = strength * 3 * Math.cos(wave);
      paint.drawImage(photo, region.x + dx, region.y + y + dy, region.w, 2, 0, y, region.w, 2);
    }
    paint.globalCompositeOperation = 'destination-in';
    paint.drawImage(mask, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(layer, region.x, region.y);
    frame = requestAnimationFrame(render);
  }
  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; last = 0;
    if (reduced.matches) ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (photo.complete && photo.naturalWidth && running()) frame = requestAnimationFrame(render);
  }
  photo.addEventListener('load', sync);
  document.querySelector('.motion-control').addEventListener('click', sync);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(canvas);
  sync();
})();
