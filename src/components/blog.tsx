import { useEffect, useState } from "react";
import { BlogList } from "@/components/blog-list";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost as BlogPostType } from "@/types/blog";

export function Blog() {
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/blogs");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      const data = await response.json();
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header posts={[]} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-48 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header posts={posts} />
      <BlogList posts={posts} />
    </div>
  );
}
