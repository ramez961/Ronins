const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach((item) => {
  item.addEventListener('mouseenter', () => {
    item.querySelector('.service-arrow').textContent = '↘';
  });

  item.addEventListener('mouseleave', () => {
    item.querySelector('.service-arrow').textContent = '↗';
  });
});
