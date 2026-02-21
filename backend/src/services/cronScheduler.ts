import { IngestionSummary } from '../types';
import { ingestArticles } from './newsFetcher';

const INTERVAL_MS = Number(process.env.CRON_INTERVAL_MS ?? 1 * 60 * 60 * 1000);

let isRunning = false;
let intervalHandle: ReturnType<typeof setInterval> | null = null;

async function runIngestion(): Promise<void> {
  if (isRunning) {
    console.log('[Scheduler] Previous run still in progress — skipping tick.');
    return;
  }

  isRunning = true;
  console.log(`[Scheduler] Tick at ${new Date().toISOString()} — starting ingestion`);

  try {
    const summary: IngestionSummary = await ingestArticles({ maxPages: 3 });
    console.log('[Scheduler] Ingestion summary:', summary);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Scheduler] Ingestion failed:', msg);
  } finally {
    isRunning = false;
    intervalHandle = null;
  }
}

export function startCronJob(): void {
  if (intervalHandle) {
    console.warn('Already running — ignoring duplicate startCronJob() call.');
    return;
  }

  intervalHandle = setInterval(runIngestion, INTERVAL_MS);

}

export function stopCronJob(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    console.log('[Scheduler] Stopped.');
  }
}