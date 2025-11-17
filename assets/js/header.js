document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('page-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 0) {
      header.classList.remove('py-6');
      header.classList.add('py-3');
      header.classList.add('shadow-sm');
    } else {
      header.classList.add('py-6');
      header.classList.remove('py-3');
      header.classList.remove('shadow-sm');
    }
  };

  window.addEventListener('scroll', handleScroll);
});
