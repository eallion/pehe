// Code block copy action via Invoker Commands API with click fallback

(() => {
  const timers = new WeakMap();
  let lastMessage = '';

  function extractCodeText(target) {
    if (!target) return '';
    if (target.matches('input, textarea')) return target.value;

    const codeEl = target.querySelector('.lntd:last-child code, pre code') || target;
    // Chroma 为每行 .line 设置了 display: flex 且 .cl 内已含源码换行，使用 innerText 会叠加出双倍空行
    const codeLines = codeEl.querySelectorAll('.line > .cl');
    const raw = codeLines.length > 0
      ? Array.from(codeLines, (cl) => cl.textContent).join('')
      : codeEl.textContent;

    return raw.trimEnd();
  }

  function legacyCopy(text) {
    const previousFocus = document.activeElement;
    const field = Object.assign(document.createElement('textarea'), { value: text });
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
  }

  function report(button, ok) {
    const tip = button.nextElementSibling;
    if (!tip) return;

    clearTimeout(timers.get(button));
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');

    let message = ok ? '已复制' : '复制失败';
    if (message === lastMessage) {
      message += '\u00A0';
    }
    lastMessage = message;

    tip.textContent = '';
    void button.offsetWidth;
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    requestAnimationFrame(() => {
      tip.textContent = message;
    });

    timers.set(button, setTimeout(() => {
      button.removeAttribute('data-copied');
      button.removeAttribute('data-failed');
      tip.textContent = '';
    }, 2000));
  }

  async function copy(button, target) {
    const text = extractCodeText(target);
    if (!text) return;

    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error('Clipboard unavailable');
      }
      await navigator.clipboard.writeText(text);
      report(button, true);
    } catch {
      report(button, legacyCopy(text));
    }
  }

  document.addEventListener('command', (event) => {
    if (event.command === '--copy' && event.source && event.target) {
      copy(event.source, event.target);
    }
  }, true);

  if (!('CommandEvent' in window)) {
    document.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      const button = event.target.closest('button[command="--copy"]');
      if (!button) return;
      const targetId = button.getAttribute('commandfor');
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) copy(button, target);
    });
  }
})();
