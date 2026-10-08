document.addEventListener('DOMContentLoaded', () => {
  // 1. Получение элементов DOM
  const hoursDisplay = document.getElementById('hours');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  const dateDisplay = document.getElementById('date');

  const neonCard = document.getElementById('neonCard');
  const themeToggle = document.getElementById('theme-toggle');
  const secondsToggle = document.getElementById('seconds-toggle');

  const canvas = document.getElementById('neon-particles');
  const ctx = canvas.getContext('2d');

  // ============================================
  //   АНИМАЦИЯ НЕОНОВОГО ДОЖДЯ / ЧАСТИЦ (CANVAS)
  // ============================================
  let particlesArray = [];
const rootStyles = getComputedStyle(document.documentElement);
const colorCyan = rootStyles.getPropertyValue('--neon-cyan').trim() || '#00f3ff';
const colorPink = rootStyles.getPropertyValue('--neon-pink').trim() || '#ff2a85';

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Инициализация

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1; 
    this.speedY = Math.random() * 0.5 + 0.2; 
    this.speedX = (Math.random() - 0.5) * 0.2; 
    this.color = Math.random() > 0.5 ? colorCyan : colorPink;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.fadeDirection = Math.random() > 0.5 ? 0.01 : -0.01;
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    this.opacity += this.fadeDirection;
    if (this.opacity >= 0.8 || this.opacity <= 0.1) {
      this.fadeDirection = -this.fadeDirection;
    }

    if (this.y < 0) {
      this.y = canvas.height;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.globalAlpha = 1; 
    ctx.shadowBlur = 0;  
  }
}

function initParticles() {
  particlesArray = [];
  const numberOfParticles = Math.min(70, (canvas.width * canvas.height) / 200); 
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();
  // ============================================
  //   УПРАВЛЕНИЕ ТЕМОЙ (DARK / LIGHT)
  // ============================================
  function setTheme(theme) {
    neonCard.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cyber-clock-theme', theme);
  }

  const savedTheme = localStorage.getItem('cyber-clock-theme') || 'dark';
  setTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = neonCard.getAttribute('data-theme');
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  // ============================================
  //   УПРАВЛЕНИЕ СЕКУНДАМИ
  // ============================================
  function setSecondsVisible(isVisible) {
    if (isVisible) {
      secondsDisplay.classList.remove('hidden');
      secondsToggle.classList.remove('inactive');
    } else {
      secondsDisplay.classList.add('hidden');
      secondsToggle.classList.add('inactive');
    }
    localStorage.setItem('cyber-clock-seconds', isVisible);
  }

  const savedSeconds = localStorage.getItem('cyber-clock-seconds');
  setSecondsVisible(savedSeconds === null ? true : savedSeconds === 'true');

  secondsToggle.addEventListener('click', () => {
    const isVisible = !secondsDisplay.classList.contains('hidden');
    setSecondsVisible(!isVisible);
  });

  // ============================================
  //   ОБНОВЛЕНИЕ ВРЕМЕНИ И ДАТЫ
  // ============================================
  function updateClock() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    hoursDisplay.textContent = hours;
    minutesDisplay.textContent = minutes;
    secondsDisplay.textContent = ':' + seconds;

    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    let dateString = now.toLocaleDateString('ru-RU', options);
    dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
    dateDisplay.textContent = dateString;
  }

  updateClock();
  setInterval(updateClock, 1000);
});
