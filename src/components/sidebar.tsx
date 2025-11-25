"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import type { BlogPost } from "@/types/blog";

interface SidebarProps {
  posts: BlogPost[];
  currentSlug?: string | null;
}

export function Sidebar({ posts, currentSlug }: SidebarProps) {
  const router = useRouter();

  const sections = useMemo(() => {
    const sectionsMap = new Map<string, BlogPost[]>();

    // Helper to extract order number from folder name (e.g., "1-start-with-writestack" -> 1)
    const extractOrderNumber = (cat: string | undefined): number | null => {
      if (!cat) return null;
      const match = cat.match(/^(\d+)-/);
      return match ? parseInt(match[1], 10) : null;
    };

    // Helper to format category name (remove number prefix and convert to Title Case)
    const formatCategory = (cat: string | undefined): string => {
      if (!cat) return "Guides";
      // Remove leading number prefix if present (e.g., "1-start-with-writestack" -> "start-with-writestack")
      const cleaned = cat.replace(/^\d+-/, "");
      // Convert kebab-case to Title Case
      return cleaned
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    };

    posts.forEach((post) => {
      const category = formatCategory(post.category);
      if (!sectionsMap.has(category)) {
        sectionsMap.set(category, []);
      }
      sectionsMap.get(category)!.push(post);
    });

    // Create sections array with ordering based on folder numbers
    const sectionsArray: Array<{ title: string; posts: BlogPost[] }> = [];

    // Get all sections with their original category names for ordering
    const sectionsWithOrder: Array<{
      title: string;
      posts: BlogPost[];
      order: number;
    }> = [];

    sectionsMap.forEach((sectionPosts, formattedTitle) => {
      // Find the original category name from posts
      const originalCategory = sectionPosts[0]?.category;
      const order = extractOrderNumber(originalCategory);
      sectionsWithOrder.push({
        title: formattedTitle,
        posts: sectionPosts,
        order: order ?? 9999, // Put unnumbered sections at the end
      });
    });

    // Sort by order number, then alphabetically for same order numbers
    sectionsWithOrder.sort((a, b) => {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });

    // Only include sections that have posts
    sectionsWithOrder.forEach(({ title, posts }) => {
      if (posts.length > 0) {
        sectionsArray.push({ title, posts });
      }
    });

    return sectionsArray;
  }, [posts]);

  const handleNavigate = (slug?: string) => {
    if (slug) {
      router.push(`/?post=${slug}`);
    } else {
      router.push("/?");
    }
  };

  const isHome = !currentSlug;

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background overflow-y-auto">
      <div className="p-4 border-b">
        <Logo
          height={32}
          width={32}
          withText
          className="cursor-pointer"
          onClick={() => handleNavigate()}
        />
      </div>

      <nav className="p-4 space-y-6">
        <button
          onClick={() => handleNavigate()}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isHome
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
          )}
        >
          <Home className="h-4 w-4" />
          <span>WriteStack Blog</span>
        </button>

        {sections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: sectionIndex * 0.05 }}
            className="space-y-2"
          >
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.posts.map((post) => {
                const isActive = currentSlug === post.slug;
                return (
                  <button
                    key={post.id}
                    onClick={() => handleNavigate(post.slug)}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 group",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="flex-1 text-left line-clamp-1">
                      {post.title}
                    </span>
                    {isActive && (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </nav>
    </aside>
  );
}

