document.addEventListener('DOMContentLoaded', function() {
    const originalUrl = document.getElementById('originalUrl');
    const convertedUrl = document.getElementById('convertedUrl');
    const convertBtn = document.getElementById('convertBtn');

    function convertUrl() {
        const input = originalUrl.value.trim();
        if (!input) {
            convertedUrl.value = "请输入URL";
            return;
        }
        // 按换行或逗号分割
        const urls = input.split(/\n|,/).map(u => u.trim()).filter(u => u);
        const results = urls.map(urlStr => {
            try {
                const url = new URL(urlStr);
                const pathParts = url.pathname.split('/').filter(part => part !== '');
                if (pathParts.length < 4 || pathParts[0] !== 'package') {
                    throw new Error("URL格式不符合预期");
                }
                const packageName = pathParts[1];
                const filePath = pathParts.slice(3).join('/');
                const version = url.searchParams.get('version');
                if (!packageName || !version) {
                    throw new Error("无法解析包名或版本号");
                }
                return `https://registry.npmmirror.com/${packageName}/${version}/files/${filePath}`;
            } catch (e) {
                return `错误: ${urlStr} -> ${e.message}`;
            }
        });
        convertedUrl.value = results.join('\n');
    }

    convertBtn.addEventListener('click', convertUrl);
});
