import { format } from "date-fns";
import { ExternalLink, User, Calendar, Globe, Bookmark } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useStore } from "../store";
import type { Article } from "../types";
import { Badge } from "./ui/badge";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";

interface NewsCardProps {
    article: Article;
}

export function NewsCard({ article }: NewsCardProps) {
    const publishDate = new Date(article.pubDate);

    // Explicitly select the state array so React knows to re-render when it changes
    const savedArticles = useStore((state) => state.savedArticles);
    const saveArticle = useStore((state) => state.saveArticle);
    const removeArticle = useStore((state) => state.removeArticle);

    const saved = savedArticles.some(a => a.article_id === article.article_id);

    const handleSaveToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (saved) {
            removeArticle(article.article_id);
            toast.info("Article removed from reading list");
        } else {
            saveArticle(article);
            toast.success("Article saved to reading list");
        }
    };

    return (
        <Card className="h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 group border-border/50 bg-card/80 backdrop-blur-sm">
            {article.image_url ? (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            (e.target as HTMLImageElement).parentElement!.style.display = "none";
                            // We could also swap to the placeholder here, but for now we fallback to the else branch in re-render
                        }}
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                        {article.category.slice(0, 2).map((cat) => (
                            <Badge key={cat} variant="secondary" className="bg-background/80 backdrop-blur-sm text-[10px] capitalize">
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative h-48 bg-linear-to-br from-primary/10 via-primary/5 to-background flex items-center justify-center border-b border-muted/30">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,var(--primary)_1px,transparent_0)] bg-size-[24px_24px]" />
                    <Globe className="w-12 h-12 text-primary/20 animate-pulse" />
                    <div className="absolute top-2 right-2 flex gap-1">
                        {article.category.slice(0, 2).map((cat) => (
                            <Badge key={cat} variant="secondary" className="bg-background/80 backdrop-blur-sm text-[10px] capitalize">
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    {article.source_icon ? (
                        <img src={article.source_icon} className="w-4 h-4 rounded-full" alt="" />
                    ) : (
                        <Globe className="w-3 h-3" />
                    )}
                    <span className="font-medium">{article.source_name || article.source_id}</span>
                    <span className="mx-1">•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{format(publishDate, "MMM d, yyyy")}</span>
                </div>
                <CardTitle className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    <Link to={`/article/${article.article_id}`} className="after:absolute after:inset-0">{article.title}</Link>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 grow">
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {article.description || article.content || "No description available."}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-muted/50 mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-[150px]">
                    <User className="w-3 h-3" />
                    <span className="truncate">
                        {article.creator.length > 0 ? article.creator.join(", ") : "Unknown Author"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveToggle}
                        className={`p-2 rounded-full transition-colors z-10 relative ${saved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-primary/10 hover:text-primary'
                            }`}
                        title={saved ? "Remove from saved" : "Save article"}
                    >
                        <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
                    </button>
                    {article.link && (
                        <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary z-10 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
