// copy.js

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy-button');
    const copyTarget = document.getElementById('copy-target');
    const successMessage = document.getElementById('copy-success-message');

    if (!copyButton || !copyTarget || !successMessage) {
        // 如果 HTML 元素不存在，则不执行逻辑
        return;
    }

    copyButton.addEventListener('click', () => {
        // 1. 获取要复制的值
        const textToCopy = copyTarget.value;

        // 2. 使用 Clipboard API 复制文本
        if (navigator.clipboard && window.isSecureContext) {
            // 现代浏览器使用异步 Clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                showSuccessMessage();
            }).catch(err => {
                console.error('Failed to copy text using Clipboard API: ', err);
                // 降级处理
                fallbackCopy(copyTarget);
            });
        } else {
            // 非安全上下文或不支持 Clipboard API 的浏览器使用降级方法
            fallbackCopy(copyTarget);
        }
    });

    // 降级复制方法 (老旧方法)
    function fallbackCopy(inputElement) {
        inputElement.select(); // 选中输入框中的文本
        inputElement.setSelectionRange(0, 99999); // 兼容移动端

        try {
            document.execCommand('copy'); // 执行复制命令
            showSuccessMessage();
        } catch (err) {
            console.error('Failed to copy text using execCommand: ', err);
            // 复制失败，可以在这里添加用户反馈
        }
    }

    // 显示复制成功提示
    function showSuccessMessage() {
        // 显示提示
        successMessage.classList.add('opacity-100');

        // 1.5 秒后隐藏提示
        setTimeout(() => {
            successMessage.classList.remove('opacity-100');
        }, 1500);
    }
});
