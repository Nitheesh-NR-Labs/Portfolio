const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
const light = document.querySelector('.cursor-light');

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
  // move the light effect
  if (light) {
    light.style.left = `${mouseX}px`;
    light.style.top = `${mouseY}px`;
  }
});

function animate() {
  // smooth follow (lerp)
  // make ring follow the dot more closely by increasing the lerp factor
  ringX += (mouseX - ringX) * 0.25;
  ringY += (mouseY - ringY) * 0.25;

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
      // make light expand a little when moving fast
      if (light) {
        const size = 200 + Math.min(dist * 0.6, 220);
        light.style.width = `${size}px`;
        light.style.height = `${size}px`;
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();

// make interactive elements trigger 'clickable' cursor morphology
const interactive = document.querySelectorAll('a, button, .card, .nav-link');
interactive.forEach(el => {
  el.addEventListener('mouseenter', () => {
    isHovering = true;
    if (ring) {
      ring.classList.add('clickable');
      ring.style.transform = 'translate(-50%, -50%) scale(1.15)';
    }
    if (light) {
      light.style.opacity = '1';
      light.style.width = '260px';
      light.style.height = '260px';
    }
  });
  el.addEventListener('mouseleave', () => {
    isHovering = false;
    if (ring) {
      ring.classList.remove('clickable');
      ring.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    if (light) {
      light.style.opacity = '0.9';
      light.style.width = '220px';
      light.style.height = '220px';
    }
  });
});

// subtle interactive tilt for the profile image based on pointer position
const profileWrap = document.querySelector('.profile-wrap');
const heroImage = document.querySelector('.hero-image');
if (profileWrap && heroImage) {
  profileWrap.addEventListener('mousemove', (e) => {
    const rect = profileWrap.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 16; // -8..8deg
    const rotateX = (0.5 - py) * 10; // -5..5deg
    heroImage.style.transform = `rotateZ(-6deg) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateY(-6px) scale(1.02)`;
  });
  profileWrap.addEventListener('mouseleave', () => {
    heroImage.style.transform = '';
  });
}

// Text scramble animation for hero name (shuffle letters then resolve)
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 30);
      this.queue.push({ from, to, start, end, char: null });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.update();
    });
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0; i < this.queue.length; i++) {
      const item = this.queue[i];
      if (this.frame >= item.end) {
        complete++;
        output += item.to;
      } else if (this.frame >= item.start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this.randomChar();
        }
        output += `<span class="dud">${item.char}</span>`;
      } else {
        output += item.from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const fx = new TextScramble(el);
  // start with a short delay so entrance animations finish
  setTimeout(() => fx.setText('Nitheesh Dharmaraja'), 320);
});
