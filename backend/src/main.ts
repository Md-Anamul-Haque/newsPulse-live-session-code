import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import connectDB from './config/db';
import newsRoutes from './routes/news';
import { startCronJob } from './services/cronScheduler';
import { ingestArticles } from './services/newsFetcher';
const PORT = process.env.PORT || 4000
const app = express()

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logger
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
app.use('/api/news', newsRoutes);
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
    await connectDB();


    app.listen(PORT, async () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    });

    // Start the cron scheduler (every 1 hours by default)
    startCronJob();

    // Run an initial ingestion on startup so the DB is populated immediately
    if (process.env.INGEST_ON_START !== 'false') {
        console.log('[Boot] Running initial ingestion...');
        ingestArticles({ maxPages: 3 }).catch((err) =>
            console.error('[Boot] Initial ingestion failed:', err.message)
        );
    }
}

boot();