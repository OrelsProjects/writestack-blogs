"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
}

export function SearchOverlay({ isOpen, onClose, posts }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "blog">("all");

  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();
    const blogResults = posts
      .filter((post) => {
        const matchesTitle = post.title.toLowerCase().includes(searchTerm);
        const matchesDescription = post.description
          .toLowerCase()
          .includes(searchTerm);
        const matchesCategory = post.category
          ?.toLowerCase()
          .includes(searchTerm);
        return matchesTitle || matchesDescription || matchesCategory;
      })
      .map((post) => ({
        ...post,
        type: "blog" as const,
        category: post.category || "Guides",
      }));

    if (activeFilter === "all") {
      return blogResults;
    } else {
      return blogResults.filter((r) => r.type === activeFilter);
    }
  }, [query, posts, activeFilter]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (result: typeof filteredResults[0]) => {
    if (result.type === "blog") {
      router.push(`/?post=${result.slug}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredResults[selectedIndex]);
    }
  };

  const blogCount = posts.filter((post) => {
    if (!query.trim()) return false;
    const searchTerm = query.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.category?.toLowerCase().includes(searchTerm)
    );
  }).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={onClose}
          />

          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-20 z-50 w-full max-w-3xl -translate-x-1/2 rounded-xl border bg-background shadow-2xl"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b p-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for anything..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters */}
            {query && (
              <div className="flex gap-2 border-b px-4 py-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                    activeFilter === "all"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  All ({blogCount})
                </button>
                <button
                  onClick={() => setActiveFilter("blog")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
                    activeFilter === "blog"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  Blog ({blogCount})
                </button>
              </div>
            )}

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {!query ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Start typing to search...
                  </p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No results found for &quot;{query}&quot;
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredResults.map((result, index) => (
                    <motion.button
                      key={`${result.type}-${result.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200",
                        selectedIndex === index
                          ? "bg-accent border border-primary/20"
                          : "hover:bg-accent/50"
                      )}
                    >
                      <div className="mt-0.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground">
                            {result.type === "blog"
                              ? `Blog${result.category ? ` > ${result.category}` : ""}`
                              : result.type}
                          </span>
                        </div>
                        <div className="font-medium text-sm mb-1 line-clamp-1">
                          {result.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {result.description}
                        </div>
                      </div>
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 transition-opacity duration-200",
                          selectedIndex === index
                            ? "opacity-100 text-primary"
                            : "opacity-0"
                        )}
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

