import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./index.css";
import GeneralLayout from "./routes/(general)/layout";
import HomePage from "./routes/(general)/page";
import ArticleDetailsPage from "./routes/(general)/article/[id]/page";
import SavedArticlesPage from "./routes/(general)/saved/page";

import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "sonner";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    Component: GeneralLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "article/:id", Component: ArticleDetailsPage },
      { path: "saved", Component: SavedArticlesPage },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ThemeProvider>
);
