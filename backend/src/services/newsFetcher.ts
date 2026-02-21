import axios, { AxiosError } from 'axios';
import Article from '../models/Article';
import {
  FetchPageResult,
  IArticle,
  IngestionOptions,
  IngestionSummary,
  NewsDataResponse,
  RawNewsArticle,
} from '../types';

const BASE_URL = 'https://newsdata.io/api/1/news';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toArray(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}


function mapArticle(raw: RawNewsArticle): IArticle {
  return {
    article_id: raw.article_id,
    title: raw.title || 'Untitled',
    link: raw.link ?? undefined,
    keywords: toArray(raw.keywords as string | string[] | null),
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
    ai_tag: toArray(raw.ai_tag as string | string[] | null),
    sentiment: raw.sentiment ?? undefined,
    sentiment_stats: raw.sentiment_stats ?? undefined,
    ai_region: toArray(raw.ai_region as string | string[] | null),
    ai_org: toArray(raw.ai_org as string | string[] | null),
    datatype: raw.datatype ?? 'article',
    fetchedAt: new Date(),
  };
}

// ─── Core fetch helpers ───────────────────────────────────────────────────────


async function fetchPage(
  apiKey: string,
  params: Record<string, string>,
  cursor: string | null
): Promise<FetchPageResult> {
  const query: Record<string, string> = {
    apikey: apiKey,
    language: process.env.DEFAULT_LANGUAGE ?? 'en',
    ...params,
  };
  if (cursor) query['page'] = cursor;

  const response = await axios.get<NewsDataResponse>(BASE_URL, {
    params: query,
    timeout: 15_000,
  });

  const data = response.data;

  if (data.status !== 'success') {
    throw new Error(
      `NewsData.io error [${data.code ?? 'unknown'}]: ${data.message ?? JSON.stringify(data)}`
    );
  }

  return {
    articles: data.results ?? [],
    nextPage: data.nextPage ?? null,
  };
}

// ─── Public ingestion function ────────────────────────────────────────────────
export async function ingestArticles(
  options: IngestionOptions = {}
): Promise<IngestionSummary> {
  const apiKey = process.env.NEWSDATA_API_KEY;
  if (!apiKey) throw new Error('NEWSDATA_API_KEY is not set in environment');

  const {
    maxPages = 3,
    language = process.env.DEFAULT_LANGUAGE ?? 'en',
    categories = process.env.DEFAULT_CATEGORIES ?? 'technology,business',
  } = options;

  let fetched = 0;
  let upserted = 0;
  let errors = 0;
  let cursor: string | null = null;

  console.log(`[Ingestion] Starting — lang=${language}, cats=${categories}`);

  for (let page = 0; page < maxPages; page++) {
    try {
      const { articles, nextPage } = await fetchPage(
        apiKey,
        { language, category: categories },
        cursor
      );

      if (!articles.length) break;
      fetched += articles.length;

      // ── Bulk upsert (keyed on article_id) ────────
      const ops = articles.map((raw) => ({
        updateOne: {
          filter: { article_id: raw.article_id },
          update: { $set: mapArticle(raw) },
          upsert: true,
        },
      }));

      const result = await Article.bulkWrite(ops, { ordered: false });
      upserted += (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0);

      cursor = nextPage;
      if (!cursor) break;

      await new Promise<void>((r) => setTimeout(r, 1_000));
    } catch (err) {
      errors++;
      const msg = err instanceof AxiosError
        ? `${err.message} (status ${err.response?.status ?? 'N/A'})`
        : String(err);
      console.error(`[Ingestion] Page ${page + 1} failed:`, msg);
      break;
    }
  }

  const summary: IngestionSummary = {
    fetched,
    upserted,
    errors,
    timestamp: new Date().toISOString(),
  };
  console.log('[Ingestion] Complete —', summary);
  return summary;
}
