const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

let mouseX = 0;
let mouseY = 0;

let ringX = 0;
let ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // dot follows instantly
  dot.style.left = `${mouseX}px`;
  dot.style.top = `${mouseY}px`;
});

function animate() {
  // smooth follow (lerp)
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;

  ring.style.left = `${ringX}px`;
  ring.style.top = `${ringY}px`;

  requestAnimationFrame(animate);
}

animate();

0.12  // smooth
0.05  // very floaty
0.2   // snappy

document.querySelectorAll('a, button, .card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(1.6)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});
