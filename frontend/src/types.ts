export interface Article {
    article_id: string;
    title: string;
    link?: string;
    keywords: string[];
    creator: string[];
    video_url?: string;
    description?: string;
    content?: string;
    pubDate: string;
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
    datatype?: string;
    fetchedAt: string;
}

export interface FilterMeta {
    languages: string[];
    countries: string[];
    categories: string[];
    datatypes: string[];
}

export interface ApiPaginatedResponse<T> {
    status: "success";
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    data: T[];
}

export interface ApiSuccessResponse<T> {
    status: "success";
    data: T;
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
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
}
