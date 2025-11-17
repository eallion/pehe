document.getElementById('theme-toggle').addEventListener('click', function() {
    const htmlClass = document.documentElement.classList;
    const storageKey = 'theme';
    const isDark = htmlClass.contains('dark');

    if (isDark) {
      htmlClass.remove('dark');
      localStorage.setItem(storageKey, 'light');
      updateThemeColor('#ffffff');
    } else {
      htmlClass.add('dark');
      localStorage.setItem(storageKey, 'dark');
      updateThemeColor('#1c2128');
    }

    function updateThemeColor(color) {
      const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
      metaThemeColors.forEach((meta, index) => {
        if (index === 0) {
          meta.setAttribute('content', color);
          meta.removeAttribute('media');
        } else {
          meta.remove();
        }
      });
    }
  });
