"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "./search-overlay";
import type { BlogPost } from "@/types/blog";

interface HeaderProps {
  posts?: BlogPost[];
}

export function Header({ posts = [] }: HeaderProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleGetStarted = () => {
    // Navigate to WriteStack signup or main site
    window.open("https://writestack.io", "_blank");
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
            : "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Logo
                height={32}
                width={32}
                withText
                includeByOrel
                className="cursor-pointer"
                onClick={() => router.push("/?")}
              />
              <div className="h-6 w-px bg-border" />
              <span className="text-sm font-medium text-muted-foreground">
                Blog
              </span>
            </div>

            {/* Search Bar */}
            <motion.div
              className="flex-1 max-w-2xl mx-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border bg-background/50 hover:bg-accent/50 transition-all duration-200 text-left group"
              >
                <Search className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span className="flex-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Search for anything...
                </span>
                <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </motion.div>

            {/* Get Started Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Button
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        posts={posts}
      />
    </>
  );
}

