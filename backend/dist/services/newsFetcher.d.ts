import { IngestionOptions, IngestionSummary } from '../types';
/**
 * Fetches up to `maxPages` pages from NewsData.io and upserts every article
 * into MongoDB using `article_id` as the deduplication key.
 *
 * Returns a summary object with counts for observability.
 */
export declare function ingestArticles(options?: IngestionOptions): Promise<IngestionSummary>;
//# sourceMappingURL=newsFetcher.d.ts.map