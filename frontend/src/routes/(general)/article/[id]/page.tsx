import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { ArrowLeft, Calendar, ExternalLink, Globe, User, Clock, Bookmark, Share2, Twitter, Linkedin, Link2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";
import type { Article, ApiSuccessResponse, ApiPaginatedResponse } from "../../../../types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

const ArticleDetailsPage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: article, isLoading, error } = useQuery({
        queryKey: ["article", id],
        queryFn: async () => {
            const response = await axios.get<ApiSuccessResponse<Article>>(`${API_BASE}/news/${id}`);
            return response.data.data;
        },
        enabled: !!id,
    });

    const { data: relatedArticles } = useQuery({
        queryKey: ["related-articles", article?.category],
        queryFn: async () => {
            const response = await axios.get<ApiPaginatedResponse<Article>>(`${API_BASE}/news`, {
                params: { category: article?.category[0], limit: 3 }
            });
            return response.data.data.filter((a: Article) => a.article_id !== id);
        },
        enabled: !!article?.category?.length,
    });

    const estimateReadingTime = (text: string) => {
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        // You could add a toast here if available
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-[400px] w-full rounded-2xl" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <div className="flex gap-4">
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="max-w-4xl mx-auto text-center py-24 space-y-6">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <ArrowLeft className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold">Article not found</h1>
                <p className="text-muted-foreground">The article you are looking for might have been removed or is temporarily unavailable.</p>
                <Button asChild>
                    <Link to="/">Return to Dashboard</Link>
                </Button>
            </div>
        );
    }

    const publishDate = new Date(article.pubDate);

    return (
        <article className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="group">
                    <Link to="/" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Feed
                    </Link>
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                        <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {article.image_url ? (
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-primary/5">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent hidden md:block" />
                    <div className="absolute bottom-6 left-6 right-6 hidden md:flex gap-2">
                        {article.category.map((cat: string) => (
                            <Badge key={cat} className="bg-white/20 backdrop-blur-md text-white border-white/30 capitalize px-4 py-1">
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background flex flex-col items-center justify-center border shadow-inner">
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_2px_2px,var(--primary)_1px,transparent_0)] [background-size:32px_32px]" />
                    <Globe className="w-24 h-24 text-primary/10" />
                    <p className="mt-4 text-sm font-medium text-muted-foreground/60 tracking-widest uppercase">Global Industry News</p>
                </div>
            )}

            <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full">
                        {article.source_icon ? (
                            <img src={article.source_icon} className="w-4 h-4 rounded-full" alt="" />
                        ) : (
                            <Globe className="w-4 h-4 text-primary" />
                        )}
                        <span className="font-semibold text-foreground">{article.source_name || article.source_id}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        <span>{format(publishDate, "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{article.content ? `${estimateReadingTime(article.content)} min read` : "Quick read"}</span>
                    </div>
                    {article.country.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{article.country.join(", ").toUpperCase()}</span>
                        </div>
                    )}
                    {article.creator.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>By {article.creator.join(", ")}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] flex-1">
                        {article.title}
                    </h1>
                    <div className="flex gap-2 shrink-0">
                        <Button variant="outline" size="icon" onClick={copyToClipboard} className="rounded-full h-10 w-10 hover:bg-primary hover:text-primary-foreground transition-colors" title="Copy Link">
                            <Link2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 hover:bg-[#1DA1F2] hover:text-white transition-colors" title="Share on X">
                            <Twitter className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-10 w-10 hover:bg-[#0A66C2] hover:text-white transition-colors" title="Share on LinkedIn">
                            <Linkedin className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 md:hidden">
                    {article.category.map((cat: string) => (
                        <Badge key={cat} variant="secondary" className="capitalize">
                            {cat}
                        </Badge>
                    ))}
                </div>
            </div>

            {article.description && article.content && (
                <div className="text-xl md:text-2xl font-medium text-muted-foreground border-l-4 border-primary/30 pl-6 py-2 leading-relaxed italic mb-8">
                    {article.description}
                </div>
            )}

            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground">
                {article.content ? (
                    <div className="text-lg leading-relaxed space-y-4 whitespace-pre-wrap">
                        {article.content}
                    </div>
                ) : article.description ? (
                    <div className="text-xl italic leading-relaxed text-muted-foreground border-l-4 border-primary/20 pl-6 py-2 whitespace-pre-wrap">
                        {article.description}
                    </div>
                ) : (
                    <p className="text-muted-foreground italic">No detailed content available for this article.</p>
                )}
            </div>

            {article.link && (
                <div className="pt-12 border-t">
                    <div className="bg-muted/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Read the full story on {article.source_name || "original source"}</h3>
                            <p className="text-sm text-muted-foreground">Continue reading this article on the official publisher's website.</p>
                        </div>
                        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 group" asChild>
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                                Visit Original Source
                                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </a>
                        </Button>
                    </div>
                </div>
            )}

            {/* Keywords / Tags */}
            {article.keywords.length > 0 && (
                <div className="space-y-4 pt-8">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                        {article.keywords.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="px-3 py-1 hover:bg-muted cursor-default transition-colors">
                                #{tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
            {/* Related Articles */}
            {relatedArticles && relatedArticles.length > 0 && (
                <div className="space-y-6 pt-12 border-t mt-12">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold">Related Stories</h3>
                        <Link to="/" className="text-sm font-medium text-primary hover:underline">View all</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedArticles.map((rel: Article) => (
                            <Link key={rel.article_id} to={`/article/${rel.article_id}`} className="group space-y-3">
                                <div className="aspect-video rounded-xl overflow-hidden bg-muted relative">
                                    {rel.image_url ? (
                                        <img src={rel.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/5 to-background">
                                            <Globe className="w-8 h-8 text-primary/10" />
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h4>
                                <p className="text-xs text-muted-foreground">{format(new Date(rel.pubDate), "MMM d, yyyy")}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
};

export default ArticleDetailsPage;
