import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  LayoutGrid,
  List as ListIcon,
  Loader2,
  Newspaper,
} from "lucide-react";
import * as React from "react";
import { useSearchParams } from "react-router";
import { FilterSidebar } from "../../components/FilterSidebar";
import { NewsCard } from "../../components/NewsCard";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  Article,
  FilterMeta,
  NewsQueryParams,
} from "../../types";

const API_BASE = "http://localhost:4000/api";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Parse filters from URL
  const filters: NewsQueryParams = React.useMemo(() => {
    const params: NewsQueryParams = {};
    if (searchParams.has("q")) params.q = searchParams.get("q")!;
    if (searchParams.has("language"))
      params.language = searchParams.get("language")!;
    if (searchParams.has("country"))
      params.country = searchParams.get("country")!;
    if (searchParams.has("category"))
      params.category = searchParams.get("category")!;
    if (searchParams.has("datatype"))
      params.datatype = searchParams.get("datatype")!;
    if (searchParams.has("author")) params.author = searchParams.get("author")!;
    if (searchParams.has("dateFrom"))
      params.dateFrom = searchParams.get("dateFrom")!;
    if (searchParams.has("dateTo")) params.dateTo = searchParams.get("dateTo")!;
    if (searchParams.has("page"))
      params.page = parseInt(searchParams.get("page")!, 10);
    return params;
  }, [searchParams]);

  // Fetch News
  const {
    data: newsData,
    isLoading: isNewsLoading,
    error: newsError,
    refetch,
  } = useQuery({
    queryKey: ["news", filters],
    queryFn: async () => {
      const response = await axios.get<ApiPaginatedResponse<Article>>(
        `${API_BASE}/news`,
        {
          params: { ...filters, limit: 12 },
        }
      );
      return response.data;
    },
  });

  // Fetch Filter Metadata
  const { data: metaData } = useQuery({
    queryKey: ["meta"],
    queryFn: async () => {
      const response = await axios.get<ApiSuccessResponse<FilterMeta>>(
        `${API_BASE}/news/meta/filters`
      );
      return response.data.data;
    },
  });

  const handleFilterChange = (newFilters: Partial<NewsQueryParams>) => {
    const nextParams = new URLSearchParams(searchParams);

    // Reset to page 1 on filter change
    nextParams.delete("page");

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("page", String(newPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - sticky on desktop */}
      <aside className="w-full lg:w-80 shrink-0">
        <div className="lg:sticky lg:top-24 bg-card rounded-2xl border p-6 shadow-sm">
          <FilterSidebar
            meta={metaData}
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>
      </aside>

      {/* Main Feed */}
      <div className="grow space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Main Feed</h1>
            <p className="text-muted-foreground mt-1">
              {newsData?.total
                ? `Showing ${newsData.total} articles`
                : "Discover the latest industry news"}
            </p>
          </div>

          <div className="flex items-center bg-muted/50 p-1 rounded-lg border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isNewsLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-muted-foreground animate-pulse text-sm font-medium">
              Crunching latest articles...
            </p>
          </div>
        ) : newsError ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-12 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-xl font-bold">Something went wrong</h3>
            <p className="text-muted-foreground">
              Unable to fetch news at the moment. Please try again later.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (newsData?.data.length ?? 0) > 0 ? (
          <>
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {(newsData?.data as Article[]).map(
                (article: Article, index: number) => (
                  <div
                    key={article.article_id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <NewsCard article={article} />
                  </div>
                )
              )}
            </div>

            {/* Pagination */}
            {newsData && newsData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={newsData.page === 1}
                  onClick={() => handlePageChange(newsData.page - 1)}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1.5 px-4 text-sm font-medium">
                  <span className="text-primary">{newsData.page}</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{newsData.totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={newsData.page === newsData.totalPages}
                  onClick={() => handlePageChange(newsData.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-muted/30 border-2 border-dashed rounded-2xl p-24 text-center space-y-4">
            <Newspaper className="h-16 w-16 text-muted-foreground/30 mx-auto" />
            <h3 className="text-xl font-bold">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to find what you're looking for.
            </p>
            <Button onClick={handleReset} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
