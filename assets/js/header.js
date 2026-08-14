document.addEventListener('DOMContentLoaded', () => {
  const headerBar = document.getElementById('ds-header-bar') || document.getElementById('page-header');
  const pageHeader = document.getElementById('page-header');
  if (!headerBar && !pageHeader) return;

  const updateHeader = () => {
    const isScrolled = window.scrollY > 80;
    if (headerBar) {
      if (isScrolled) {
        headerBar.classList.add('is-scrolled');
      } else {
        headerBar.classList.remove('is-scrolled');
      }
    }
    if (pageHeader && pageHeader !== headerBar) {
      if (isScrolled) {
        pageHeader.classList.add('is-scrolled');
      } else {
        pageHeader.classList.remove('is-scrolled');
      }
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
});
