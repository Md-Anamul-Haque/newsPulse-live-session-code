import { Bookmark, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";

const SavedArticlesPage = () => {
    const { savedArticles } = useStore();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between border-b border-border/50 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Bookmark className="h-8 w-8 text-primary" />
                        Reading List
                    </h1>
                    <p className="text-muted-foreground">
                        Your personal collection of saved articles.
                    </p>
                </div>
                <Button variant="outline" asChild className="hidden sm:flex group">
                    <Link to="/" className="gap-2">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Feed
                    </Link>
                </Button>
            </div>

            {savedArticles.length === 0 ? (
                <div className="text-center py-24 space-y-6 border border-dashed rounded-3xl bg-muted/10">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Bookmark className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold tracking-tight">No articles saved yet</h2>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            When you find an interesting article, click the bookmark icon to save it here for later reading.
                        </p>
                    </div>
                    <Button asChild className="rounded-full px-8">
                        <Link to="/">Discover News</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {savedArticles.map((article) => (
                        <div key={article.article_id} className="animate-in zoom-in-95 duration-300">
                            <NewsCard article={article} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedArticlesPage;
