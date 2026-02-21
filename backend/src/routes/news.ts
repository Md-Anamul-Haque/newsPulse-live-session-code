import { Request, Response, Router } from 'express';
import { SortOrder } from 'mongoose';
import Article from '../models/Article';
import {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
  FilterMeta,
  IArticleDocument,
  NewsQueryParams
} from '../types';


const router: Router = Router();

// ─── Utility ──────────────────────────────────────────────────────────────────

function parseList(value: string | undefined): string[] {
  return value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
}

// ─── GET /api/news ────────────────────────────────────────────────────────────

router.get(
  '/',
  async (
    req: Request<Record<string, never>, unknown, unknown, NewsQueryParams>,
    res: Response<ApiPaginatedResponse<IArticleDocument> | ApiErrorResponse>
  ): Promise<void> => {
    try {
      const {
        q,
        language,
        country,
        category,
        datatype,
        author,
        dateFrom,
        dateTo,
        page = '1',
        limit = '20',
        sortBy = 'pubDate',
        sortOrder = 'desc',
      } = req.query;

      // ── Pagination ────────────────────────────────────────────────────────
      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      // ── Sort ──────────────────────────────────────────────────────────────
      const ALLOWED_SORT = ['pubDate', 'source_priority'] as const;
      type SortField = typeof ALLOWED_SORT[number];
      const sortField: SortField = ALLOWED_SORT.includes(sortBy as SortField)
        ? (sortBy as SortField)
        : 'pubDate';
      const sortDir: SortOrder = sortOrder === 'asc' ? 1 : -1;

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
      }
      const [articles, total] = await Promise.all([
        Article.find(filters)
          .sort({ [sortField]: sortDir })
          .skip(skip)
          .limit(limitNum)
          .select('-__v -content')
          .lean<IArticleDocument[]>(),
        Article.countDocuments(filters),
      ]);

      res.json({
        status: 'success',
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        data: articles,
      } satisfies ApiPaginatedResponse<IArticleDocument>);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[GET /api/news] Error:', msg);
      res.status(500).json({ status: 'error', message: msg });
    }
  }
);

// ─── GET /api/news/meta/filters ───────────────────────────────────────────────

router.get(
  '/meta/filters',
  async (
    _req: Request,
    res: Response<ApiSuccessResponse<FilterMeta> | ApiErrorResponse>
  ): Promise<void> => {
    try {
      const [languages, countries, categories, datatypes] = await Promise.all([
        Article.distinct('language'),
        Article.distinct('country'),
        Article.distinct('category'),
        Article.distinct('datatype'),
      ]);

      res.json({
        status: 'success',
        data: {
          languages: (languages as string[]).filter(Boolean).sort(),
          countries: (countries as string[]).filter(Boolean).sort(),
          categories: (categories as string[]).filter(Boolean).sort(),
          datatypes: (datatypes as string[]).filter(Boolean).sort(),
        },
      } satisfies ApiSuccessResponse<FilterMeta>);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ status: 'error', message: msg });
    }
  }
);

// ─── GET /api/news/:article_id ────────────────────────────────────────────────

router.get(
  '/:article_id',
  async (
    req: Request<{ article_id: string }>,
    res: Response<ApiSuccessResponse<IArticleDocument> | ApiErrorResponse>
  ): Promise<void> => {
    try {
      const article = await Article
        .findOne({ article_id: req.params.article_id })
        .lean<IArticleDocument>();

      if (!article) {
        res.status(404).json({ status: 'error', message: 'Article not found' });
        return;
      }

      res.json({ status: 'success', data: article });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.status(500).json({ status: 'error', message: msg });
    }
  }
);

export default router;