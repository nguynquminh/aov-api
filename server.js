const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Khởi tạo app
const app = express();
const PORT = process.env.PORT || 3636;
const author = 'Nguyễn Quang Minh';

// Cấu hình trust proxy để xử lý X-Forwarded-For header chính xác
app.set('trust proxy', true);

// Cấu hình rate limiting (60 requests/phút)
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 60, // giới hạn 60 requests
    message: {
        success: false,
        message: 'Quá nhiều request từ IP này, vui lòng thử lại sau 1 phút',
        author: author
    },
    skip: (req) => req.url === '/api/system-status/ping' // Bỏ qua endpoint ping
});

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(limiter);

// Custom logging middleware
const requestStats = {
    count: 0,
    requests: [],
    lastReset: new Date().toISOString(),
    trackedIPs: {} // Theo dõi IP đã log để tránh log liên tục
};

const shouldLogRequest = (ip) => {
    const now = Date.now();
    const threshold = 5000; // 5 giây
    const lastRequest = requestStats.trackedIPs[ip];

    if (!lastRequest || (now - lastRequest) > threshold) {
        requestStats.trackedIPs[ip] = now;
        return true;
    }
    return false;
};

app.use((req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress;

    requestStats.count++;

    if (shouldLogRequest(clientIP)) {
        if (requestStats.requests.length >= 100) {
            requestStats.requests.shift();
        }

        requestStats.requests.push({
            ip: clientIP,
            method: req.method,
            url: req.url,
            timestamp: new Date().toISOString()
        });

        console.log(`[#${requestStats.count}] ${new Date().toLocaleString()} | IP: ${clientIP} | ${req.method} ${req.url}`);
    }

    next();
});

// Load dữ liệu
const DATA_DIR = path.join(__dirname, 'data');

const loadJsonData = (filename) => {
    try {
        const filePath = path.join(DATA_DIR, filename);
        const rawData = fs.readFileSync(filePath);
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return null;
    }
};

const badgesData = loadJsonData('badges.json') || [];
const equipmentsData = loadJsonData('equipments.json') || [];
const heroesData = loadJsonData('heroes.json') || [];
const runesData = loadJsonData('runes.json') || [];
const spellsData = loadJsonData('spells.json') || [];
const gamemodeData = loadJsonData('gamemodes.json') || [];

// API Documentation
const API_DOCS = {
    title: "Liên Quân Mobile API",
    description: "API cung cấp dữ liệu về Liên Quân Mobile",
    version: "1.0.3", // Cập nhật version để khớp với HTML
    author: author,
    endpoints: [{
            method: 'GET',
            path: '/api/badges',
            description: 'Lấy tất cả huy hiệu'
        },
        {
            method: 'GET',
            path: '/api/badges/search?q={term}',
            description: 'Tìm kiếm huy hiệu'
        },
        {
            method: 'GET',
            path: '/api/heroes',
            description: 'Lấy tất cả tướng'
        },
        {
            method: 'GET',
            path: '/api/heroes/search?q={term}',
            description: 'Tìm kiếm tướng'
        },
        {
            method: 'GET',
            path: '/api/equipments',
            description: 'Lấy tất cả trang bị'
        },
        {
            method: 'GET',
            path: '/api/equipments/search?q={term}',
            description: 'Tìm kiếm trang bị'
        },
        {
            method: 'GET',
            path: '/api/runes',
            description: 'Lấy tất cả bảng ngọc'
        },
        {
            method: 'GET',
            path: '/api/runes/search?q={term}',
            description: 'Tìm kiếm bảng ngọc'
        },
        {
            method: 'GET',
            path: '/api/spells',
            description: 'Lấy tất cả phép bổ trợ'
        },
        {
            method: 'GET',
            path: '/api/spells/search?q={term}',
            description: 'Tìm kiếm phép bổ trợ'
        },
        {
            method: 'GET',
            path: '/api/ping',
            description: 'Xem trạng thái hệ thống'
        },
        {
            method: 'GET',
            path: '/api/gamemodes',
            description: 'Lấy tất cả chế độ chơi'
        },
        {
            method: 'GET',
            path: '/api/gamemodes/search?q={term}',
            description: 'Tìm kiếm chế độ chơi'
        }
    ]
};

// API Routes
app.get('/api/badges', (req, res) => {
    try {
        res.json({
            success: true,
            count: badgesData.length,
            data: badgesData,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching badges',
            author: author
        });
    }
});

app.get('/api/badges/search', (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm || searchTerm.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required and must be at least 2 characters',
                author: author
            });
        }

        const term = searchTerm.toLowerCase();
        let responseType = 'skill';
        let results = [];

        const matchedBadges = badgesData.filter(badge =>
            badge.name.toLowerCase().includes(term)
        );

        if (matchedBadges.length > 0) {
            responseType = 'badge';
            results = matchedBadges;
        } else {
            const matchedSkills = [];

            badgesData.forEach(badge => {
                badge.groups.forEach(group => {
                    group.skills.forEach(skill => {
                        if (skill.name.toLowerCase().includes(term) ||
                            skill.type.toLowerCase().includes(term)) {
                            matchedSkills.push({
                                ...skill,
                                badge_name: badge.name,
                                group_id: group.group_id
                            });
                        }
                    });
                });
            });

            results = matchedSkills;
        }

        res.json({
            success: true,
            search_type: responseType,
            count: results.length,
            data: results,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching badges',
            error: error.message,
            author: author
        });
    }
});

app.get('/api/heroes', (req, res) => {
    try {
        res.json({
            success: true,
            count: heroesData.length,
            data: heroesData,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching heroes',
            author: author
        });
    }
});

app.get('/api/heroes/search', (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required',
                author: author
            });
        }

        const term = searchTerm.toLowerCase();
        const results = heroesData.filter(hero =>
            hero.name.toLowerCase().includes(term) ||
            (hero.keyword && hero.keyword.toLowerCase().includes(term))
        );

        res.json({
            success: true,
            count: results.length,
            data: results,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching heroes',
            author: author
        });
    }
});

app.get('/api/equipments', (req, res) => {
    try {
        res.json({
            success: true,
            count: equipmentsData.length,
            data: equipmentsData,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching equipments',
            author: author
        });
    }
});

app.get('/api/equipments/search', (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required',
                author: author
            });
        }

        const term = searchTerm.toLowerCase();
        const results = equipmentsData.filter(equipment =>
            (equipment.name && equipment.name.toLowerCase().includes(term)) ||
            (equipment.price && equipment.price.toLowerCase().includes(term)) ||
            (equipment.stats && equipment.stats.some(stat => stat.toLowerCase().includes(term)))
        );

        res.json({
            success: true,
            count: results.length,
            data: results,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching equipments',
            author: author
        });
    }
});

app.get('/api/runes', (req, res) => {
    try {
        res.json({
            success: true,
            count: runesData.length,
            data: runesData,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching runes',
            author: author
        });
    }
});

app.get('/api/runes/search', (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required',
                author: author
            });
        }

        const term = searchTerm.toLowerCase();
        const results = runesData.filter(rune =>
            (rune.name && rune.name.toLowerCase().includes(term)) ||
            (rune.description && rune.description.toLowerCase().includes(term)) ||
            (rune.effect && rune.effect.toLowerCase().includes(term))
        );

        res.json({
            success: true,
            count: results.length,
            data: results,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching runes',
            author: author
        });
    }
});

app.get('/api/spells', (req, res) => {
    try {
        res.json({
            success: true,
            count: spellsData.length,
            data: spellsData,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching spells',
            author: author
        });
    }
});

app.get('/api/spells/search', (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required',
                author: author
            });
        }

        const term = searchTerm.toLowerCase();
        const results = spellsData.filter(spell =>
            (spell.name && spell.name.toLowerCase().includes(term)) ||
            (spell.description && spell.description.toLowerCase().includes(term)) ||
            (spell.effect && spell.effect.toLowerCase().includes(term))
        );

        res.json({
            success: true,
            count: results.length,
            data: results,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching spells',
            author: author
        });
    }
});

app.get('/api/gamemodes', (req, res) => {
    try {
        res.json({
            success: true,
            count: gamemodeData.length,
            data: gamemodeData,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching gamemode',
            author: author
        });
    }
});

app.get('/api/gamemodes/search', (req, res) => {
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term (q) is required',
                author: author
            });
        }

        const term = searchTerm.toLowerCase();
        const results = gamemodeData.filter(gamemode => {
            const name = gamemode.name?.toLowerCase() || '';
            const rules = gamemode.rules?.toLowerCase() || '';
            const descriptionText = Array.isArray(gamemode.description) ?
                gamemode.description.join(' ').toLowerCase() :
                gamemode.description?.toLowerCase() || '';

            return name.includes(term) || rules.includes(term) || descriptionText.includes(term);
        });

        res.json({
            success: true,
            count: results.length,
            data: results,
            author: author
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching gamemodes',
            author: author
        });
    }
});

app.get('/api', (req, res) => {
    res.json(API_DOCS);
});

app.get('/api/ping', (req, res) => {
    res.json({
        success: true,
        ping: 'pong',
        timestamp: new Date().toISOString(),
        author: author
    });
});

// Helper functions
function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Setup daily reset
function setupDailyReset() {
    const now = new Date();
    const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
    );

    setTimeout(() => {
        requestStats.count = 0;
        requestStats.requests = [];
        requestStats.lastReset = new Date().toISOString();
        requestStats.trackedIPs = {};
        console.log('🔄 Đã reset request counter');
        setupDailyReset();
    }, nextMidnight - now);
}

// Khởi động server
setupDailyReset();

app.get('/api', (req, res) => {
    res.json({
        ...API_DOCS,
        status: 'running',
        serverTime: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║ 🚀 Server đã khởi động trên port ${PORT}    ║`);
    console.log(`║ 🌐 Truy cập: http://localhost:${PORT}      ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
    console.log('📌 Các endpoints chính:');
    console.log('├─ /api/badges          - Lấy danh sách phù hiệu');
    console.log('├─ /api/heroes          - Lấy danh sách tướng');
    console.log('├─ /api/equipments      - Lấy danh sách trang bị');
    console.log('├─ /api/runes           - Lấy danh sách ngọc');
    console.log('├─ /api/spells          - Lấy danh sách phép bổ trợ');
    console.log('└─ /api/gamemodes       - Lấy danh sách các chế độ chơi\n');
    console.log('🔒 Rate limit: 60 requests/phút');
    console.log('📊 Logging IP: Bật (không log liên tục)');
});
