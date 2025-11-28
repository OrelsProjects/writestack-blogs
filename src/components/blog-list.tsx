"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import type { BlogPost } from "@/types/blog";

interface BlogListProps {
  posts: BlogPost[];
}

interface BlogSection {
  title: string;
  posts: BlogPost[];
}

export function BlogList({ posts }: BlogListProps) {
  const router = useRouter();

  const handlePostClick = (slug: string) => {
    router.push(`/?post=${slug}`);
  };

  const sections = useMemo(() => {
    const sectionsMap = new Map<string, BlogPost[]>();
    
    // Helper to extract number from folder name (e.g., "1-start-with-writestack" -> 1)
    const extractOrderNumber = (cat: string | undefined): number | null => {
      if (!cat) return null;
      const match = cat.match(/^(\d+)-/);
      return match ? parseInt(match[1], 10) : null;
    };

    // Helper to format category name (handle kebab-case and capitalize properly)
    const formatCategory = (cat: string | undefined): string => {
      if (!cat) return "Guides";
      // Remove leading number prefix if present (e.g., "1-start-with-writestack" -> "start-with-writestack")
      const cleaned = cat.replace(/^\d+-/, "");
      // Convert kebab-case to Title Case
      return cleaned
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    };
    
    // Group posts by category, default to "Guides" if no category
    posts.forEach((post) => {
      const category = formatCategory(post.category);
      if (!sectionsMap.has(category)) {
        sectionsMap.set(category, []);
      }
      sectionsMap.get(category)!.push(post);
    });

    // Sort posts within each section by numeric prefix in filename
    sectionsMap.forEach((sectionPosts) => {
      // Get the original category name from the first post (all posts in section have same category)
      const originalCategory = sectionPosts[0]?.category;
      
      // Helper to extract order number from slug/filename
      const extractPostOrderNumber = (slug: string): number | null => {
        if (!originalCategory) return null;
        
        // Remove category prefix from slug to get filename part
        // e.g., "1-start-with-writestack-1-basics" -> "1-basics" (if category is "1-start-with-writestack")
        const categorySlug = originalCategory.toLowerCase();
        const filenamePart = slug.replace(new RegExp(`^${categorySlug}-`), "");
        
        // Extract numeric prefix from filename part
        const match = filenamePart.match(/^(\d+)-/);
        return match ? parseInt(match[1], 10) : null;
      };

      sectionPosts.sort((a, b) => {
        const orderA = extractPostOrderNumber(a.slug);
        const orderB = extractPostOrderNumber(b.slug);
        
        // If both have order numbers, sort by them
        if (orderA !== null && orderB !== null) {
          return orderA - orderB;
        }
        
        // If only one has an order number, it comes first
        if (orderA !== null && orderB === null) {
          return -1;
        }
        if (orderA === null && orderB !== null) {
          return 1;
        }
        
        // If neither has an order number, sort alphabetically by title
        return a.title.localeCompare(b.title);
      });
    });

    // Create sections array with ordering based on folder numbers
    const sectionsArray: BlogSection[] = [];

    // Get all sections with their original category names for ordering
    const sectionsWithOrder: Array<{
      title: string;
      posts: BlogPost[];
      order: number;
    }> = [];

    sectionsMap.forEach((sectionPosts, formattedTitle) => {
      // Only include sections that have posts
      if (sectionPosts.length === 0) return;
      
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

    sectionsWithOrder.forEach(({ title, posts }) => {
      sectionsArray.push({ title, posts });
    });

    return sectionsArray;
  }, [posts]);

  const guidesPosts = useMemo(() => {
    // Get posts from the first section (ordered by folder number)
    return sections.length > 0 ? sections[0].posts : [];
  }, [sections]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-8">
      {/* Top Section - WriteStack Blog */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          WriteStack Blog
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed mb-4">
          WriteStack is a performance-driven platform built for Substack writers
          who want to grow faster without adding more work to their day. It
          gives you the tools that actually move the needle: Personalized Notes,
          effortless scheduling, clean analytics, and reader insights that help
          you publish with intention instead of guesswork.
          <br /> <br />I streamline your entire workflow so you can focus on writing
          while WriteStack handles the consistency, the data, and the growth
          engine behind the scenes.
        </p>
        <a
          href="https://writestack.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
        >
          Get started today with for Free <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Get started Section */}
      {guidesPosts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-6">
            Get started
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {guidesPosts.slice(0, 4).map((post) => (
              <Card
                key={post.id}
                className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group h-full"
                onClick={() => handlePostClick(post.slug)}
                role="article"
                tabIndex={0}
                aria-label={`Read blog post: ${post.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePostClick(post.slug);
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base group-hover:text-primary transition-colors mb-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-base">
                        {post.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other Sections */}
      {sections.slice(1).length > 0 && (
        <div className="space-y-12">
          {sections.slice(1).map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                  {section.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {section.posts.map((post) => (
                    <Card
                      key={post.id}
                      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group h-full"
                      onClick={() => handlePostClick(post.slug)}
                      role="article"
                      tabIndex={0}
                      aria-label={`Read blog post: ${post.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePostClick(post.slug);
                        }
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-base group-hover:text-primary transition-colors mb-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base">
                          {post.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto space-y-4">
            <p className="text-muted-foreground text-lg">No blog posts yet.</p>
            <p className="text-sm text-muted-foreground">
              Add markdown files to the src/blogs folder to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
