"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const articleSchema = new mongoose_1.Schema({
    // ── Unique identifier from NewsData.io — used for upsert deduplication
    article_id: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    // ── Core content
    title: { type: String, required: true },
    link: { type: String },
    keywords: [{ type: String }],
    creator: [{ type: String }], // author(s)
    video_url: { type: String },
    description: { type: String },
    content: { type: String },
    pubDate: { type: Date, index: true },
    pubDateTZ: { type: String },
    // ── Source metadata
    image_url: { type: String },
    source_id: { type: String },
    source_name: { type: String },
    source_url: { type: String },
    source_icon: { type: String },
    source_priority: { type: Number },
    // ── Classification
    language: { type: String, index: true },
    country: [{ type: String }], // array — article may cover multiple countries
    category: [{ type: String }], // array — e.g. ["technology", "business"]
    ai_tag: [{ type: String }],
    sentiment: { type: String },
    sentiment_stats: { type: mongoose_1.Schema.Types.Mixed },
    ai_region: [{ type: String }],
    ai_org: [{ type: String }],
    datatype: { type: String, index: true }, // "article" | "blog" | "video" | …
    // ── Internal tracking
    fetchedAt: { type: Date, default: () => new Date() },
}, {
    timestamps: true,
    collection: 'articles',
});
// ── Compound indexes for common query patterns ──────────────────────────────
articleSchema.index({ pubDate: -1, language: 1 });
articleSchema.index({ category: 1, pubDate: -1 });
articleSchema.index({ country: 1, pubDate: -1 });
articleSchema.index({ datatype: 1, pubDate: -1 });
// ── Full-text search index ──────────────────────────────────────────────────
articleSchema.index({ title: 'text', description: 'text', content: 'text' }, { name: 'article_text_search', weights: { title: 3, description: 2, content: 1 } });
const Article = (0, mongoose_1.model)('Article', articleSchema);
exports.default = Article;
//# sourceMappingURL=Article.js.map