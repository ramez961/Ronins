const menu = document.querySelector('.site-menu');
if (menu) {
  const summary = menu.querySelector('summary');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { menu.open = false; });
  });
}
