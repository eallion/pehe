// toc.js — Fumadocs Default Style TOC
// Supports both article TOC (#toc-inner) and archive TOC (#archive-toc)

document.addEventListener('DOMContentLoaded', () => {
  const articleToc = document.getElementById('toc-inner');
  const archiveToc = document.getElementById('archive-toc');

  if (articleToc) {
    initToc(articleToc, '#content h2, #content h3, #content h4, #content h5');
  } else if (archiveToc) {
    initToc(archiveToc, '.archive-list h3, .archive-list h4');
  }
});

// ═══════════════════════════════════════════════════════
// Unified TOC init
// ═══════════════════════════════════════════════════════
function initToc(tocInner, headingSelector) {
  const tocLinks = Array.from(tocInner.querySelectorAll('a'));
  if (tocLinks.length === 0) return;

  const headings = Array.from(document.querySelectorAll(headingSelector));
  if (headings.length === 0) return;

  tocLinks.forEach(link => {
    link.setAttribute('data-depth', String(getDepth(link, tocInner)));
  });

  const { trackSvg, trackPath, indicatorSvg, indicatorPath, dot } = createSvgElements();
  tocInner.prepend(dot, indicatorSvg, trackSvg);

  const generatePath = () => buildBezierPath(tocLinks, tocInner);

  let currentActiveLink = null;

  const findLinkByHeading = (heading) => {
    if (!heading) return null;
    return tocLinks.find(link => matchHref(link, heading.id)) || null;
  };

  const updateActiveVisuals = (link) => {
    if (link === currentActiveLink) return;
    currentActiveLink = link;

    const d = generatePath();
    trackPath.setAttribute('d', d);
    indicatorPath.setAttribute('d', d);

    if (!link) {
      tocLinks.forEach(l => l.setAttribute('data-active', 'false'));
      dot.style.opacity = '0';
      indicatorSvg.style.clipPath = 'polygon(0 0, 100% 0, 100% 0, 0 0)';
      return;
    }

    const activeIdx = tocLinks.indexOf(link);

    // Highlight all links from top down to active (Fumadocs range highlight)
    tocLinks.forEach((l, i) => {
      l.setAttribute('data-active', String(i <= activeIdx));
    });

    const points = tocLinks.map(el => getItemCenter(el, tocInner));

    // Clip SVG indicator from first item to active item
    if (activeIdx >= 0 && points.length > 0) {
      const topY = points[0].y - 8;
      const bottomY = points[activeIdx].y + 8;
      indicatorSvg.style.clipPath = `polygon(0 ${topY}px, 100% ${topY}px, 100% ${bottomY}px, 0 ${bottomY}px)`;
    }

    // Position dot at active item center
    const pt = points[activeIdx];
    if (pt) {
      dot.style.opacity = '1';
      dot.style.left = `${pt.x - 3}px`;
      dot.style.top = `${pt.y - 3}px`;
    }

    autoScrollToc(link, tocInner);
  };

  const observer = createObserver(headings, tocLinks, findLinkByHeading, updateActiveVisuals);
  headings.forEach(h => observer.observe(h));

  onResize(() => {
    const d = generatePath();
    trackPath.setAttribute('d', d);
    indicatorPath.setAttribute('d', d);
    if (currentActiveLink) updateActiveVisuals(currentActiveLink);
  });

  setupMobilePopover(tocInner);

  const d = generatePath();
  trackPath.setAttribute('d', d);
  indicatorPath.setAttribute('d', d);
}

// ═══════════════════════════════════════════════════════
// Shared utilities
// ═══════════════════════════════════════════════════════

function getDepth(el, container) {
  let depth = 0;
  let node = el.parentElement;
  while (node && node !== container) {
    if (node.tagName === 'UL') depth++;
    node = node.parentElement;
  }
  return Math.max(0, depth - 1);
}

function matchHref(link, targetId) {
  const href = link.getAttribute('href') || '';
  if (!href.startsWith('#')) return false;
  try {
    return decodeURIComponent(href.slice(1)) === targetId;
  } catch {
    return href.slice(1) === targetId;
  }
}

const DEPTH_OFFSETS = [0, 12, 24, 36];

function getItemCenter(el, tocInner) {
  const innerRect = tocInner.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const scrollArea = tocInner.closest('.toc-scroll-area') || tocInner.closest('.toc-scroll-wrapper');
  const scrollTop = scrollArea ? scrollArea.scrollTop : 0;
  const y = elRect.top - innerRect.top + scrollTop + elRect.height / 2;
  const depth = parseInt(el.getAttribute('data-depth') || '0', 10);
  const x = DEPTH_OFFSETS[Math.min(depth, DEPTH_OFFSETS.length - 1)] || 0;
  return { x, y };
}

function buildBezierPath(tocLinks, tocInner) {
  const points = tocLinks.map(el => getItemCenter(el, tocInner));
  if (points.length === 0) return '';

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function createSvgElements() {
  const svgNS = 'http://www.w3.org/2000/svg';

  const trackSvg = document.createElementNS(svgNS, 'svg');
  trackSvg.classList.add('toc-track');
  trackSvg.setAttribute('width', '60');
  trackSvg.setAttribute('height', '100%');
  trackSvg.style.position = 'absolute';
  trackSvg.style.top = '0';
  trackSvg.style.left = '0';
  trackSvg.style.pointerEvents = 'none';
  const trackPath = document.createElementNS(svgNS, 'path');
  trackSvg.appendChild(trackPath);

  const indicatorSvg = document.createElementNS(svgNS, 'svg');
  indicatorSvg.classList.add('toc-indicator');
  indicatorSvg.setAttribute('width', '60');
  indicatorSvg.setAttribute('height', '100%');
  indicatorSvg.style.position = 'absolute';
  indicatorSvg.style.top = '0';
  indicatorSvg.style.left = '0';
  indicatorSvg.style.pointerEvents = 'none';
  const indicatorPath = document.createElementNS(svgNS, 'path');
  indicatorSvg.appendChild(indicatorPath);

  const dot = document.createElement('div');
  dot.className = 'toc-dot';

  return { trackSvg, trackPath, indicatorSvg, indicatorPath, dot };
}

function createObserver(headings, tocLinks, findLinkByHeading, updateActiveVisuals) {
  let activeLinks = new Set();

  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const link = findLinkByHeading(entry.target);
        if (!link) return;
        if (entry.isIntersecting) {
          activeLinks.add(link);
        } else {
          activeLinks.delete(link);
        }
      });

      if (activeLinks.size > 0) {
        const sorted = Array.from(activeLinks).sort((a, b) => {
          return tocLinks.indexOf(a) - tocLinks.indexOf(b);
        });
        updateActiveVisuals(sorted[0]);
      } else {
        let closest = null;
        let minDist = Infinity;
        for (const h of headings) {
          const rect = h.getBoundingClientRect();
          const dist = Math.abs(rect.top - 96);
          if (dist < minDist) {
            minDist = dist;
            closest = h;
          }
        }
        updateActiveVisuals(findLinkByHeading(closest));
      }
    },
    { threshold: 0.9, rootMargin: '-96px 0px -60% 0px' }
  );
}

function autoScrollToc(link, tocInner) {
  const scrollArea = tocInner.closest('.toc-scroll-area') || tocInner.closest('.toc-scroll-wrapper');
  if (!scrollArea || !link) return;

  const linkRect = link.getBoundingClientRect();
  const scrollAreaRect = scrollArea.getBoundingClientRect();
  const linkRelativeTop = linkRect.top - scrollAreaRect.top;
  const margin = 32;

  if (linkRelativeTop < margin) {
    scrollArea.scrollBy({ top: linkRelativeTop - margin, behavior: 'smooth' });
  } else if (linkRelativeTop + linkRect.height > scrollAreaRect.height - margin) {
    scrollArea.scrollBy({
      top: linkRelativeTop + linkRect.height - scrollAreaRect.height + margin,
      behavior: 'smooth'
    });
  }
}

function onResize(callback) {
  let raf = null;
  window.addEventListener('resize', () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      callback();
    });
  });
}

function setupMobilePopover(tocInner) {
  const trigger = document.getElementById('toc-mobile-trigger');
  const dialog = document.getElementById('toc-mobile-dialog');
  const closeBtn = document.getElementById('toc-mobile-close');
  const mobileList = document.getElementById('toc-mobile-list');

  if (!trigger || !dialog || !mobileList) return;

  const nav = tocInner.querySelector('nav');
  if (nav) {
    mobileList.appendChild(nav.cloneNode(true));
  }

  trigger.addEventListener('click', () => dialog.showModal());
  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  mobileList.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') dialog.close();
  });
}
