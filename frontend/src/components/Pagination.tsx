import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const showMax = 5;

        if (totalPages <= showMax) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push("ellipsis-1");

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push("ellipsis-2");
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-full shadow-sm"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, idx) => {
                    if (typeof page === "string") {
                        return (
                            <div key={idx} className="w-10 h-10 flex items-center justify-center text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </div>
                        );
                    }

                    const isActive = page === currentPage;
                    return (
                        <Button
                            key={idx}
                            variant={isActive ? "default" : "outline"}
                            size="icon"
                            onClick={() => onPageChange(page)}
                            className={cn(
                                "h-10 w-10 rounded-full transition-all duration-300 shadow-sm",
                                isActive ? "scale-110 shadow-primary/20" : "hover:border-primary/50"
                            )}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-full shadow-sm"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
