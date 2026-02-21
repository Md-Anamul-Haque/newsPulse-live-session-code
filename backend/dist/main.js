"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const news_1 = __importDefault(require("./routes/news"));
const cronScheduler_1 = require("./services/cronScheduler");
const newsFetcher_1 = require("./services/newsFetcher");
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
// ─── Middleware ───────────────────────────────────────────────────────────────
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
app.use('/api/news', news_1.default);
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
    });
});
// 404 fallthrough
app.use((_req, res) => {
    res.status(404).json({ status: 'error', message: 'Route not found' });
});
// ─── Boot sequence ────────────────────────────────────────────────────────────
async function boot() {
    await (0, db_1.default)();
    app.listen(PORT, async () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    // Start the cron scheduler (every 6 hours by default)
    (0, cronScheduler_1.startCronJob)();
    // Run an initial ingestion on startup so the DB is populated immediately
    if (process.env.INGEST_ON_START !== 'false') {
        console.log('[Boot] Running initial ingestion...');
        (0, newsFetcher_1.ingestArticles)({ maxPages: 3 }).catch((err) => console.error('[Boot] Initial ingestion failed:', err.message));
    }
}
boot();
//# sourceMappingURL=main.js.map