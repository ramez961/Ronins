const serviceItems = document.querySelectorAll('.service-item');
const workLink = document.querySelector('.work-link');

serviceItems.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    item.querySelector('.service-arrow').textContent = '↘';
  });

  item.addEventListener('mouseleave', () => {
    item.querySelector('.service-arrow').textContent = '↗';
  });
});

if (workLink) {
  workLink.addEventListener('mouseenter', () => {
    workLink.querySelector('span').textContent = '↘';
  });

  workLink.addEventListener('mouseleave', () => {
    workLink.querySelector('span').textContent = '↗';
  });
}

const statNumbers = document.querySelectorAll('.stat-number');

const animateStat = (element) => {
  if (element.dataset.animated) return;
  element.dataset.animated = 'true';
  element.classList.add('is-counting');

  const target = element.dataset.value;
  if (target === '∞') {
    window.setTimeout(() => {
      element.firstChild.textContent = '∞';
    }, 420);
    return;
  }

  const end = Number(target);
  const duration = end > 50 ? 760 : 520;
  const start = performance.now();
  const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(easeOut(progress) * end);
    element.firstChild.textContent = element.dataset.format === 'pad'
      ? String(value).padStart(2, '0')
      : String(value);
    if (progress < 1) window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateStat(entry.target);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.35 });

statNumbers.forEach((stat) => statsObserver.observe(stat));
