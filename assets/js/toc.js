// toc.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. 元素选择器
    // 确保选择器包含 h2 到 h5
    const headings = document.querySelectorAll('#content h2, #content h3, #content h4, #content h5');
    const tocLinks = document.querySelectorAll('.toc-content-wrapper a');

    // 关键：选择滚动容器
    const tocScrollWrapper = document.querySelector('.toc-scroll-wrapper');
    const tocNav = document.querySelector('.toc-nav');

    // 激活线偏移量 (距离视口顶部 100px 触发激活)
    const ACTIVATION_OFFSET = 100;

    if (headings.length === 0 || tocLinks.length === 0 || !tocScrollWrapper) {
        return;
    }

    // ============================================
    // 动态计算并设置 TOC 滚动容器的最大高度
    // ============================================
    const updateTocMaxHeight = () => {
        // 只在大屏幕 (lg) 时执行
        if (window.innerWidth < 1024) {
            tocScrollWrapper.style.maxHeight = '';
            return;
        }

        if (!tocNav) return;

        // 获取 TOC nav 的位置信息
        const navRect = tocNav.getBoundingClientRect();
        const navTop = navRect.top;

        // 计算可用高度：视口高度 - nav 距离顶部的距离 - 底部留白(2rem = 32px)
        const availableHeight = window.innerHeight - navTop - 32;

        // 获取 nav 的 padding 和 header 高度
        const navStyles = window.getComputedStyle(tocNav);
        const navPadding = parseFloat(navStyles.paddingTop) + parseFloat(navStyles.paddingBottom);

        // 获取 header 部分的高度（包含标题和边框）
        const tocHeader = tocNav.querySelector('.mb-4');
        const headerHeight = tocHeader ? tocHeader.offsetHeight + parseFloat(window.getComputedStyle(tocHeader).marginBottom) : 0;

        // 计算 toc-scroll-wrapper 的最大高度
        const maxHeight = availableHeight - navPadding - headerHeight;

        // 设置最大高度，确保至少有 200px
        tocScrollWrapper.style.maxHeight = `${Math.max(maxHeight, 200)}px`;
    };

    // 页面加载、滚动和窗口大小改变时更新高度
    updateTocMaxHeight();
    window.addEventListener('scroll', updateTocMaxHeight);
    window.addEventListener('resize', updateTocMaxHeight);

    // ============================================
    // 原有的 TOC 激活逻辑
    // ============================================

    // 映射：将标题 ID 映射到 TOC 链接元素
    const headingLinkMap = {};
    tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const id = href.substring(1);
            headingLinkMap[id] = link;
        }
    });

    let rAF_running = false;
    let lastActiveId = null;

    // 核心滚动检测函数
    const updateActiveTocLink = () => {
        let currentActiveId = null;

        // 从文章底部向上遍历，找出最靠上的激活标题
        for (let i = headings.length - 1; i >= 0; i--) {
            const heading = headings[i];
            const rect = heading.getBoundingClientRect();

            // 判断条件：标题的顶部位置 <= 激活线
            if (rect.top <= ACTIVATION_OFFSET) {
                currentActiveId = heading.id;
                break;
            }
        }

        // 1. 更新激活状态
        let activeLink = null;
        tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentActiveId}`) {
                link.classList.add('active');
                activeLink = link;
            } else {
                link.classList.remove('active');
            }
        });

        // 2. 自动滚动激活链接到可见区域
        // 注意：只在激活状态真正改变时才滚动，避免频繁滚动
        if (activeLink && currentActiveId !== lastActiveId && window.innerWidth >= 1024) {
            // 只在桌面端启用自动滚动（lg 及以上屏幕）
            // 使用 scrollIntoView({ block: 'nearest' })
            // 'nearest' 意味着只有当元素不在可见区域时才滚动，并且滚动到最近的边缘
            activeLink.scrollIntoView({
                behavior: 'smooth', // 平滑滚动
                block: 'nearest'    // 滚动到最近的可见边缘（顶部或底部）
            });
        }

        // 更新 lastActiveId
        lastActiveId = currentActiveId;

        rAF_running = false;
    };

    // 使用 requestAnimationFrame 限制滚动事件的执行频率
    const onScroll = () => {
        if (!rAF_running) {
            requestAnimationFrame(updateActiveTocLink);
            rAF_running = true;
        }
    };

    window.addEventListener('scroll', onScroll);

    // 页面加载和调整大小时执行一次
    updateActiveTocLink();
    window.addEventListener('resize', updateActiveTocLink);
});
