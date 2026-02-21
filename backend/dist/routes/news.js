"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Article_1 = __importDefault(require("../models/Article"));
const router = (0, express_1.Router)();
// ─── Utility ──────────────────────────────────────────────────────────────────
function parseList(value) {
    return value
        ? value.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
}
// ─── GET /api/news ────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
    try {
        const { q, language, country, category, datatype, author, dateFrom, dateTo, page = '1', limit = '20', sortBy = 'pubDate', sortOrder = 'desc', } = req.query;
        // ── Pagination ────────────────────────────────────────────────────────
        const pageNum = Math.max(1, parseInt(page, 10));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
        const skip = (pageNum - 1) * limitNum;
        // ── Sort ──────────────────────────────────────────────────────────────
        const ALLOWED_SORT = ['pubDate', 'source_priority'];
        const sortField = ALLOWED_SORT.includes(sortBy)
            ? sortBy
            : 'pubDate';
        const sortDir = sortOrder === 'asc' ? 1 : -1;
        const filters = {
            ...(q?.trim() ? { $text: { $search: q.trim() } } : {}),
            ...(language ? { language: { $in: parseList(language) } } : {}),
            ...(country ? { country: { $in: parseList(country) } } : {}),
            ...(category ? { category: { $in: parseList(category) } } : {}),
            ...(datatype ? { datatype: { $in: parseList(datatype) } } : {}),
            ...(author?.trim()
                ? { creator: { $elemMatch: { $regex: author.trim(), $options: 'i' } } }
                : {}),
            ...((dateFrom || dateTo)
                ? {
                    pubDate: {
                        ...(dateFrom ? { $gte: new Date(dateFrom) } : {}),
                        ...(dateTo
                            ? (() => {
                                const end = new Date(dateTo);
                                end.setHours(23, 59, 59, 999);
                                return { $lte: end };
                            })()
                            : {}),
                    },
                }
                : {}),
        };
        const [articles, total] = await Promise.all([
            Article_1.default.find(filters)
                .sort({ [sortField]: sortDir })
                .skip(skip)
                .limit(limitNum)
                .select('-__v -content')
                .lean(),
            Article_1.default.countDocuments(filters),
        ]);
        res.json({
            status: 'success',
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
            data: articles,
        });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[GET /api/news] Error:', msg);
        res.status(500).json({ status: 'error', message: msg });
    }
});
// ─── GET /api/news/meta/filters ───────────────────────────────────────────────
router.get('/meta/filters', async (_req, res) => {
    try {
        const [languages, countries, categories, datatypes] = await Promise.all([
            Article_1.default.distinct('language'),
            Article_1.default.distinct('country'),
            Article_1.default.distinct('category'),
            Article_1.default.distinct('datatype'),
        ]);
        res.json({
            status: 'success',
            data: {
                languages: languages.filter(Boolean).sort(),
                countries: countries.filter(Boolean).sort(),
                categories: categories.filter(Boolean).sort(),
                datatypes: datatypes.filter(Boolean).sort(),
            },
        });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ status: 'error', message: msg });
    }
});
// ─── GET /api/news/:article_id ────────────────────────────────────────────────
router.get('/:article_id', async (req, res) => {
    try {
        const article = await Article_1.default
            .findOne({ article_id: req.params.article_id })
            .lean();
        if (!article) {
            res.status(404).json({ status: 'error', message: 'Article not found' });
            return;
        }
        res.json({ status: 'success', data: article });
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        res.status(500).json({ status: 'error', message: msg });
    }
});
exports.default = router;
//# sourceMappingURL=news.js.map