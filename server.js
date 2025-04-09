const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
let serverStartTime = new Date();
let requestCount = 0;

const app = express();
const PORT = process.env.PORT || 3636;
const author = 'Nguyễn Quang Minh';

const API_DOCS = {
    title: "Liên Quân Mobile API",
    description: "API cung cấp dữ liệu về Liên Quân Mobile",
    version: "1.0.0",
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
            path: '/api/system-status',
            description: 'Xem trạng thái hệ thống'
        }
    ]
};

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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

const badgesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'badges.json')) || []);
const equipmentsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'equipments.json'))) || [];
const heroesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'heroes.json'))) || [];
const runesData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'runes.json'))) || [];
const spellsData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'spells.json'))) || [];

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

        const response = {
            success: true,
            search_type: responseType,
            count: results.length,
            data: results,
            author: author
        };

        res.json(response);
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

app.use((req, res, next) => {
    requestCount++;
    next();
});

app.get('/api/system-status', (req, res) => {
    const uptime = process.uptime();
    res.json({
        success: true,
        data: {
            version: API_DOCS.version,
            uptime: formatUptime(uptime),
            requestCount,
            serverStartTime,
            status: 'running'
        }
    });
});

function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

app.get('/api/system-status/ping', (req, res) => {
    res.json({
        success: true,
        ping: 'pong'
    });
});

setInterval(() => {
    requestCount = 0;
}, 24 * 60 * 60 * 1000);

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log(`Homepage: http://localhost:${PORT}/index.html`);
    console.log('- GET /api/badges');
    console.log('- GET /api/badges/search?q={term}');
    console.log('- GET /api/heroes');
    console.log('- GET /api/heroes/search?q={term}');
    console.log('- GET /api/equipments');
    console.log('- GET /api/equipments/search?q={term}');
    console.log('- GET /api/runes');
    console.log('- GET /api/runes/search?q={term}');
    console.log('- GET /api/spells');
    console.log('- GET /api/spells/search?q={term}');
});
