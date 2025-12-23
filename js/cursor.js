const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;
let isHovering = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // dot follows instantly
  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }
});

function animate() {
  // smooth follow (lerp)
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  if (ring) {
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    if (!isHovering) {
      // small zoom effect proportional to cursor movement distance
      const dx = mouseX - ringX;
      const dy = mouseY - ringY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const scale = 1 + Math.min(dist / 1200, 0.06); // very subtle
      ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
      ring.classList.add('glow');
    }
  }

  requestAnimationFrame(animate);
}

animate();

document.querySelectorAll('a, button, .card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    isHovering = true;
    if (ring) ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
  });
  el.addEventListener('mouseleave', () => {
    isHovering = false;
    if (ring) ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});
