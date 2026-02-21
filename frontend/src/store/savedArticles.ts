import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Article } from "../types";

export interface SavedArticlesState {
    savedArticles: Article[];
    saveArticle: (article: Article) => void;
    removeArticle: (articleId: string) => void;
    isArticleSaved: (articleId: string) => boolean;
}

export const useSavedArticlesStore = create<SavedArticlesState>()(
    persist(
        (set, get) => ({
            savedArticles: [],
            saveArticle: (article) => {
                const currentArticles = get().savedArticles;
                if (!currentArticles.some(a => a.article_id === article.article_id)) {
                    set({ savedArticles: [...currentArticles, article] });
                }
            },
            removeArticle: (articleId) => {
                set((state) => ({
                    savedArticles: state.savedArticles.filter(a => a.article_id !== articleId),
                }));
            },
            isArticleSaved: (articleId) => {
                return get().savedArticles.some(a => a.article_id === articleId);
            },
        }),
        {
            name: "newspulse-storage", // name of the item in the storage (must be unique)
        }
    )
);
