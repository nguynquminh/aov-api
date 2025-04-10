// Tạo hiệu ứng trái tim theo chuột
const cursorHeart = document.getElementById('cursorHeart');
document.addEventListener('mousemove', (e) => {
    cursorHeart.style.left = e.clientX + 'px';
    cursorHeart.style.top = e.clientY + 'px';
});

// Tạo hiệu ứng trái tim bay ngẫu nhiên
const floatingHearts = document.getElementById('floatingHearts');
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart-particle';
    heart.innerHTML = '❤';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 10 + 5) + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    floatingHearts.appendChild(heart);
    
    // Xóa heart sau khi animation kết thúc
    setTimeout(() => {
        heart.remove();
    }, 15000);
}

// Tạo 10 trái tim bay
for (let i = 0; i < 10; i++) {
    setTimeout(createFloatingHeart, i * 1500);
}

// Tiếp tục tạo trái tim mới
setInterval(createFloatingHeart, 1500);

// Hiển thị response
function showResponse(elementId, response) {
    const loader = document.getElementById(elementId + 'Loader');
    const responseBox = document.getElementById(elementId);
    
    loader.style.display = 'none';
    responseBox.style.display = 'block';
    responseBox.textContent = typeof response === 'string' ? response : JSON.stringify(response, null, 2);
}

// Ẩn response
function hideResponse(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

// Hiển thị loader
function showLoader(elementId) {
    document.getElementById(elementId + 'Loader').style.display = 'block';
    hideResponse(elementId);
}

// Test ping endpoint
function testPing() {
    showLoader('ping');
    
    fetch('/api/ping')
        .then(response => response.json())
        .then(data => showResponse('ping', data))
        .catch(error => showResponse('ping', { error: error.message }));
}

// Thử endpoint không cần tham số
function tryEndpoint(endpoint) {
    const elementId = endpoint.replace(/\//g, '-').substring(1);
    
    if (!document.getElementById(elementId)) {
        // Tạo response box nếu chưa có
        const card = event.target.closest('.endpoint-card');
        const responseBox = document.createElement('pre');
        responseBox.className = 'response-box';
        responseBox.id = elementId;
        card.appendChild(responseBox);
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.id = elementId + 'Loader';
        card.appendChild(loader);
    }
    
    showLoader(elementId);
    
    fetch(endpoint)
        .then(response => response.json())
        .then(data => showResponse(elementId, data))
        .catch(error => showResponse(elementId, { error: error.message }));
}

// Thử endpoint với tìm kiếm
function tryEndpointWithSearch(endpoint) {
    const searchTerm = prompt('Nhập từ khóa tìm kiếm:');
    if (searchTerm === null || searchTerm.trim() === '') return;
    
    const fullEndpoint = `${endpoint}?q=${encodeURIComponent(searchTerm)}`;
    const elementId = endpoint.replace(/\//g, '-').substring(1);
    
    if (!document.getElementById(elementId)) {
        // Tạo response box nếu chưa có
        const card = event.target.closest('.endpoint-card');
        const responseBox = document.createElement('pre');
        responseBox.className = 'response-box';
        responseBox.id = elementId;
        card.appendChild(responseBox);
        
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.id = elementId + 'Loader';
        card.appendChild(loader);
    }
    
    showLoader(elementId);
    
    fetch(fullEndpoint)
        .then(response => response.json())
        .then(data => showResponse(elementId, data))
        .catch(error => showResponse(elementId, { error: error.message }));
}