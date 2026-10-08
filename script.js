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
  let particles = [];

  function resizeCanvas() {
    canvas.width = neonCard.offsetWidth;
    canvas.height = neonCard.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class RainParticle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * -canvas.height;
      this.length = Math.random() * 12 + 4;
      this.speed = Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.y += this.speed;
      if (this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      const isDark = neonCard.getAttribute('data-theme') === 'dark';
      const color = isDark ? `rgba(199, 36, 177, ${this.opacity})` : `rgba(255, 42, 133, ${this.opacity})`;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x, this.y + this.length);
      ctx.stroke();
    }
  }

  // Инициализация частиц
  for (let i = 0; i < 25; i++) {
    particles.push(new RainParticle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
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