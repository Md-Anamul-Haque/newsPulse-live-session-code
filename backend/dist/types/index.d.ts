import { Document, Types } from 'mongoose';
export interface RawNewsArticle {
    article_id: string;
    title: string;
    link?: string;
    keywords?: string[] | null;
    creator?: string | string[] | null;
    video_url?: string | null;
    description?: string | null;
    content?: string | null;
    pubDate?: string | null;
    pubDateTZ?: string | null;
    image_url?: string | null;
    source_id?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    source_icon?: string | null;
    source_priority?: number | null;
    language?: string | null;
    country?: string | string[] | null;
    category?: string | string[] | null;
    ai_tag?: string[] | null;
    sentiment?: string | null;
    sentiment_stats?: Record<string, number> | null;
    ai_region?: string[] | null;
    ai_org?: string[] | null;
    datatype?: string | null;
}
export interface NewsDataResponse {
    status: 'success' | 'error';
    totalResults?: number;
    results?: RawNewsArticle[];
    nextPage?: string | null;
    message?: string;
    code?: string;
}
export interface IArticle {
    article_id: string;
    title: string;
    link?: string;
    keywords: string[];
    creator: string[];
    video_url?: string;
    description?: string;
    content?: string;
    pubDate?: Date;
    pubDateTZ?: string;
    image_url?: string;
    source_id?: string;
    source_name?: string;
    source_url?: string;
    source_icon?: string;
    source_priority?: number;
    language?: string;
    country: string[];
    category: string[];
    ai_tag: string[];
    sentiment?: string;
    sentiment_stats?: Record<string, number>;
    ai_region: string[];
    ai_org: string[];
    datatype?: string;
    fetchedAt: Date;
}
export interface IArticleDocument extends IArticle, Document {
    _id: Types.ObjectId;
}
export interface IngestionOptions {
    maxPages?: number;
    language?: string;
    categories?: string;
}
export interface IngestionSummary {
    fetched: number;
    upserted: number;
    errors: number;
    timestamp: string;
}
export interface FetchPageResult {
    articles: RawNewsArticle[];
    nextPage: string | null;
}
export interface NewsQueryParams {
    q?: string;
    language?: string;
    country?: string;
    category?: string;
    datatype?: string;
    author?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
}
export interface FilterMeta {
    languages: string[];
    countries: string[];
    categories: string[];
    datatypes: string[];
}
export interface ApiSuccessResponse<T> {
    status: 'success';
    data: T;
}
export interface ApiPaginatedResponse<T> {
    status: 'success';
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: T[];
}
export interface ApiErrorResponse {
    status: 'error';
    message: string;
}
//# sourceMappingURL=index.d.ts.map