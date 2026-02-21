"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestArticles = ingestArticles;
const axios_1 = __importStar(require("axios"));
const Article_1 = __importDefault(require("../models/Article"));
const BASE_URL = 'https://newsdata.io/api/1/news';
// ─── Helpers ─────────────────────────────────────────────────────────────────
/** Normalises a field that NewsData.io may return as string, array, or null. */
function toArray(value) {
    if (!value)
        return [];
    return Array.isArray(value) ? value : [value];
}
/** Maps a raw NewsData.io article to our MongoDB document shape. */
function mapArticle(raw) {
    return {
        article_id: raw.article_id,
        title: raw.title || 'Untitled',
        link: raw.link ?? undefined,
        keywords: toArray(raw.keywords),
        creator: toArray(raw.creator),
        video_url: raw.video_url ?? undefined,
        description: raw.description ?? undefined,
        content: raw.content ?? undefined,
        pubDate: raw.pubDate ? new Date(raw.pubDate) : undefined,
        pubDateTZ: raw.pubDateTZ ?? undefined,
        image_url: raw.image_url ?? undefined,
        source_id: raw.source_id ?? undefined,
        source_name: raw.source_name ?? raw.source_id ?? undefined,
        source_url: raw.source_url ?? undefined,
        source_icon: raw.source_icon ?? undefined,
        source_priority: raw.source_priority ?? undefined,
        language: raw.language ?? undefined,
        country: toArray(raw.country),
        category: toArray(raw.category),
        ai_tag: toArray(raw.ai_tag),
        sentiment: raw.sentiment ?? undefined,
        sentiment_stats: raw.sentiment_stats ?? undefined,
        ai_region: toArray(raw.ai_region),
        ai_org: toArray(raw.ai_org),
        datatype: raw.datatype ?? 'article',
        fetchedAt: new Date(),
    };
}
// ─── Core fetch helpers ───────────────────────────────────────────────────────
/** Fetches a single page from NewsData.io. */
async function fetchPage(apiKey, params, cursor) {
    const query = {
        apikey: apiKey,
        language: process.env.DEFAULT_LANGUAGE ?? 'en',
        ...params,
    };
    if (cursor)
        query['page'] = cursor;
    const response = await axios_1.default.get(BASE_URL, {
        params: query,
        timeout: 15_000,
    });
    const data = response.data;
    if (data.status !== 'success') {
        throw new Error(`NewsData.io error [${data.code ?? 'unknown'}]: ${data.message ?? JSON.stringify(data)}`);
    }
    return {
        articles: data.results ?? [],
        nextPage: data.nextPage ?? null,
    };
}
// ─── Public ingestion function ────────────────────────────────────────────────
/**
 * Fetches up to `maxPages` pages from NewsData.io and upserts every article
 * into MongoDB using `article_id` as the deduplication key.
 *
 * Returns a summary object with counts for observability.
 */
async function ingestArticles(options = {}) {
    const apiKey = process.env.NEWSDATA_API_KEY;
    if (!apiKey)
        throw new Error('NEWSDATA_API_KEY is not set in environment');
    const { maxPages = 3, language = process.env.DEFAULT_LANGUAGE ?? 'en', categories = process.env.DEFAULT_CATEGORIES ?? 'technology,business', } = options;
    let fetched = 0;
    let upserted = 0;
    let errors = 0;
    let cursor = null;
    console.log(`[Ingestion] Starting — lang=${language}, cats=${categories}`);
    for (let page = 0; page < maxPages; page++) {
        try {
            const { articles, nextPage } = await fetchPage(apiKey, { language, category: categories }, cursor);
            if (!articles.length)
                break;
            fetched += articles.length;
            // ── Bulk upsert (keyed on article_id, never creates duplicates) ────────
            const ops = articles.map((raw) => ({
                updateOne: {
                    filter: { article_id: raw.article_id },
                    update: { $set: mapArticle(raw) },
                    upsert: true,
                },
            }));
            const result = await Article_1.default.bulkWrite(ops, { ordered: false });
            upserted += (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0);
            cursor = nextPage;
            if (!cursor)
                break;
            await new Promise((r) => setTimeout(r, 1_000));
        }
        catch (err) {
            errors++;
            const msg = err instanceof axios_1.AxiosError
                ? `${err.message} (status ${err.response?.status ?? 'N/A'})`
                : String(err);
            console.error(`[Ingestion] Page ${page + 1} failed:`, msg);
            break; // Don't hammer the API after an error
        }
    }
    const summary = {
        fetched,
        upserted,
        errors,
        timestamp: new Date().toISOString(),
    };
    console.log('[Ingestion] Complete —', summary);
    return summary;
}
//# sourceMappingURL=newsFetcher.js.map