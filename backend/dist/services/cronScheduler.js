"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJob = startCronJob;
exports.stopCronJob = stopCronJob;
const newsFetcher_1 = require("./newsFetcher");
// Default: every 6 hours in ms. Override with CRON_INTERVAL_MS env var.
const INTERVAL_MS = Number(process.env.CRON_INTERVAL_MS ?? 1 * 60 * 60 * 1000);
// Prevents overlapping runs if a fetch takes longer than the interval
let isRunning = false;
let intervalHandle = null;
async function runIngestion() {
    if (isRunning) {
        console.log('[Scheduler] Previous run still in progress — skipping tick.');
        return;
    }
    isRunning = true;
    console.log(`[Scheduler] Tick at ${new Date().toISOString()} — starting ingestion`);
    try {
        const summary = await (0, newsFetcher_1.ingestArticles)({ maxPages: 3 });
        console.log('[Scheduler] Ingestion summary:', summary);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[Scheduler] Ingestion failed:', msg);
    }
    finally {
        isRunning = false;
        intervalHandle = null;
    }
}
function startCronJob() {
    if (intervalHandle) {
        console.warn('Already running — ignoring duplicate startCronJob() call.');
        return;
    }
    intervalHandle = setInterval(runIngestion, INTERVAL_MS);
}
function stopCronJob() {
    if (intervalHandle) {
        clearInterval(intervalHandle);
        intervalHandle = null;
        console.log('[Scheduler] Stopped.');
    }
}
//# sourceMappingURL=cronScheduler.js.map