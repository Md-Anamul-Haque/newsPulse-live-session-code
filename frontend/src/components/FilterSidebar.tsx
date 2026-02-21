import { Search, RotateCcw, Filter, X } from "lucide-react";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import type { FilterMeta, NewsQueryParams } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { DateRangePicker } from "./DateRangePicker";

interface FilterSidebarProps {
    meta: FilterMeta | undefined;
    filters: NewsQueryParams;
    onFilterChange: (filters: Partial<NewsQueryParams>) => void;
    onReset: () => void;
}

export function FilterSidebar({
    meta,
    filters,
    onFilterChange,
    onReset,
}: FilterSidebarProps) {
    const [localSearch, setLocalSearch] = React.useState(filters.q || "");
    const [localAuthor, setLocalAuthor] = React.useState(filters.author || "");

    // Sync local search with filters.q when filters.q changes externally (e.g. on reset)
    React.useEffect(() => {
        setLocalSearch(filters.q || "");
    }, [filters.q]);

    React.useEffect(() => {
        setLocalAuthor(filters.author || "");
    }, [filters.author]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ q: localSearch });
    };

    const handleAuthorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFilterChange({ author: localAuthor });
    };

    const dateRange: DateRange | undefined =
        filters.dateFrom && filters.dateTo
            ? {
                from: new Date(filters.dateFrom),
                to: new Date(filters.dateTo),
            }
            : undefined;

    const handleDateChange = (range: DateRange | undefined) => {
        onFilterChange({
            dateFrom: range?.from?.toISOString(),
            dateTo: range?.to?.toISOString(),
        });
    };

    const selectedCategories = filters.category ? filters.category.split(",") : [];

    const toggleCategory = (cat: string) => {
        let newCategories: string[];
        if (selectedCategories.includes(cat)) {
            newCategories = selectedCategories.filter((c) => c !== cat);
        } else {
            newCategories = [...selectedCategories, cat];
        }
        onFilterChange({ category: newCategories.join(",") || undefined });
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-left duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    Filters
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onReset}
                    className="h-8 px-2 text-muted-foreground hover:text-primary"
                >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                </Button>
            </div>

            <div className="space-y-4">
                {/* Search Query */}
                <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-semibold">Search</Label>
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <Input
                            id="search"
                            placeholder="Keywords..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="pr-10 focus-visible:ring-primary/50"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-primary"
                        >
                            <Search className="w-4 h-4" />
                        </Button>
                    </form>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Date Range</Label>
                    <DateRangePicker value={dateRange} onChange={handleDateChange} />
                </div>

                {/* Author */}
                <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-semibold">Author</Label>
                    <form onSubmit={handleAuthorSubmit} className="relative">
                        <Input
                            id="author"
                            placeholder="Filter by author..."
                            value={localAuthor}
                            onChange={(e) => setLocalAuthor(e.target.value)}
                            className="pr-10 focus-visible:ring-primary/50"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            variant="ghost"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground hover:text-primary"
                        >
                            <Search className="w-4 h-4" />
                        </Button>
                    </form>
                </div>

                {/* Language */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Language</Label>
                    <Select
                        value={filters.language || "_all"}
                        onValueChange={(val) =>
                            onFilterChange({ language: val === "_all" ? undefined : val })
                        }
                    >
                        <SelectTrigger className="w-full focus:ring-primary/50">
                            <SelectValue placeholder="All Languages" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">All Languages</SelectItem>
                            {meta?.languages.map((lang) => (
                                <SelectItem key={lang} value={lang}>
                                    {lang.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Country */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Country</Label>
                    <Select
                        value={filters.country || "_all"}
                        onValueChange={(val) =>
                            onFilterChange({ country: val === "_all" ? undefined : val })
                        }
                    >
                        <SelectTrigger className="w-full focus:ring-primary/50">
                            <SelectValue placeholder="All Countries" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">All Countries</SelectItem>
                            {meta?.countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                    {country.toUpperCase()}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Category (Multi-select) */}
                <div className="space-y-3">
                    <Label className="text-sm font-semibold">Categories</Label>
                    <div className="flex flex-wrap gap-2">
                        {meta?.categories.map((cat) => {
                            const selected = selectedCategories.includes(cat);
                            return (
                                <Badge
                                    key={cat}
                                    variant={selected ? "default" : "outline"}
                                    className={cn(
                                        "cursor-pointer capitalize py-1 px-3 transition-all",
                                        selected
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "hover:border-primary/50 hover:bg-primary/5"
                                    )}
                                    onClick={() => toggleCategory(cat)}
                                >
                                    {cat}
                                    {selected && <X className="w-3 h-3 ml-1" />}
                                </Badge>
                            );
                        })}
                    </div>
                </div>

                {/* Content Type */}
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">Content Type</Label>
                    <Select
                        value={filters.datatype || "_all"}
                        onValueChange={(val) =>
                            onFilterChange({ datatype: val === "_all" ? undefined : val })
                        }
                    >
                        <SelectTrigger className="w-full focus:ring-primary/50">
                            <SelectValue placeholder="All types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_all">All types</SelectItem>
                            {meta?.datatypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
