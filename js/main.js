// 页面加载状态标志
let isLoadingPage = false;

// 切换导航栏展开/收起
function toggleNav() {
    const nav = document.getElementById('floatingNav');
    nav.classList.toggle('collapsed');
}

// 更新导航栏活动状态
function updateNavActive(pageName) {
    const navItems = document.querySelectorAll('.nav-item a');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
}

// 页面加载函数
function loadPage(pageName) {
    // 防止重复加载
    if (isLoadingPage) {
        return;
    }
    isLoadingPage = true;
    
    const contentSection = document.getElementById('content');
    const topicsSection = document.querySelector('.topics');
    
    // 添加淡出效果
    contentSection.classList.add('fade-out');
    contentSection.classList.remove('fade-in');
    
    // 更新导航栏活动状态
    updateNavActive(pageName);
    
    // 等待淡出动画完成后加载内容
    setTimeout(() => {
        // 隐藏主题卡片区域
        if (topicsSection) {
            topicsSection.style.display = 'none';
        }
        
        // 显示加载状态
        contentSection.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 加载中...</div>';
        
        // 加载页面内容
        fetch(`pages/${pageName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('页面未找到');
                }
                return response.text();
            })
            .then(html => {
                contentSection.innerHTML = html;
                
                // 移除淡出类，添加淡入类
                contentSection.classList.remove('fade-out');
                contentSection.classList.add('fade-in');
                
                // 平滑滚动到内容区域顶部
                setTimeout(() => {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = contentSection.offsetTop - navbarHeight - 20;
                    window.scrollTo({ 
                        top: targetPosition, 
                        behavior: 'smooth' 
                    });
                }, 100);
                
                // 重新初始化代码高亮或其他功能
                initPageFeatures();
                
                // 重置加载状态
                isLoadingPage = false;
            })
            .catch(error => {
                contentSection.innerHTML = `
                    <div class="page-content">
                        <h2>页面加载失败</h2>
                        <p>抱歉，无法加载该页面内容。</p>
                        <button class="back-button" onclick="goHome()">返回首页</button>
                    </div>
                `;
                contentSection.classList.remove('fade-out');
                contentSection.classList.add('fade-in');
                
                // 重置加载状态
                isLoadingPage = false;
            });
    }, 300);
}

// 返回首页
function goHome() {
    // 防止重复加载
    if (isLoadingPage) {
        return;
    }
    isLoadingPage = true;
    
    const contentSection = document.getElementById('content');
    const topicsSection = document.querySelector('.topics');
    
    // 添加淡出效果
    contentSection.classList.add('fade-out');
    contentSection.classList.remove('fade-in');
    
    // 清除所有导航项的活动状态
    const navItems = document.querySelectorAll('.nav-item a');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 等待淡出动画完成
    setTimeout(() => {
        // 清空内容区域
        contentSection.innerHTML = '';
        
        // 显示主题卡片区域
        if (topicsSection) {
            topicsSection.style.display = 'block';
        }
        
        // 移除淡出类，添加淡入类
        contentSection.classList.remove('fade-out');
        contentSection.classList.add('fade-in');
        
        // 平滑滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 重置加载状态
        isLoadingPage = false;
    }, 300);
}

// 搜索功能
function searchContent() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        alert('请输入搜索关键词');
        return;
    }
    
    // 搜索关键词映射
    const searchMap = {
        '基础': 'basics',
        '入门': 'basics',
        '介绍': 'basics',
        '区块链': 'blockchain',
        '区块': 'blockchain',
        '链': 'blockchain',
        '密码': 'cryptography',
        '加密': 'cryptography',
        '哈希': 'cryptography',
        '签名': 'cryptography',
        '挖矿': 'mining',
        '矿工': 'mining',
        '工作量证明': 'mining',
        'pow': 'mining',
        '交易': 'transactions',
        '转账': 'transactions',
        'utxo': 'transactions',
        '网络': 'network',
        'p2p': 'network',
        '节点': 'network',
        '共识': 'consensus',
        '分叉': 'consensus',
        '脚本': 'script',
        '智能合约': 'script',
        '钱包': 'wallet',
        '地址': 'wallet',
        '私钥': 'wallet',
        '安全': 'security',
        '攻击': 'security',
        '高级': 'advanced',
        'segwit': 'advanced',
        '闪电网络': 'advanced',
        '实现': 'implementation',
        '源码': 'implementation',
        '代码': 'implementation'
    };
    
    // 查找匹配
    for (let keyword in searchMap) {
        if (query.includes(keyword)) {
            loadPage(searchMap[keyword]);
            return;
        }
    }
    
    // 没有找到匹配
    alert(`未找到关于 "${query}" 的内容，请尝试其他关键词`);
}

// 搜索框回车事件
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchContent();
            }
        });
    }
});

// 初始化页面功能
function initPageFeatures() {
    // 为所有返回按钮添加事件
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('onclick') === 'goHome()') {
                e.preventDefault();
                goHome();
            }
        });
    });
    
    // 代码块复制功能
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach(block => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '<i class="fas fa-copy"></i> 复制代码';
        button.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
        `;
        
        block.style.position = 'relative';
        block.appendChild(button);
        
        button.addEventListener('click', function() {
            const code = block.querySelector('code');
            const text = code ? code.textContent : block.textContent;
            navigator.clipboard.writeText(text).then(() => {
                button.innerHTML = '<i class="fas fa-check"></i> 已复制';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-copy"></i> 复制代码';
                }, 2000);
            });
        });
    });
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
