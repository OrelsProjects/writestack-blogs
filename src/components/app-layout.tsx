"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { BlogList } from "@/components/blog-list";
import { BlogPost } from "@/components/blog-post";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost as BlogPostType } from "@/types/blog";

export function AppLayout() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [currentPost, setCurrentPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);

  const currentSlug = searchParams.get("post");

  useEffect(() => {
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

    loadPosts();
  }, []);

  useEffect(() => {
    if (!currentSlug) {
      setCurrentPost(null);
      return;
    }

    setPostLoading(true);
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${currentSlug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setCurrentPost(data);
      } catch (error) {
        console.error("Error loading post:", error);
        setCurrentPost(null);
      } finally {
        setPostLoading(false);
      }
    };

    loadPost();
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header posts={[]} />
        <div className="flex">
          <aside className="w-64 border-r bg-background p-4">
            <Skeleton className="h-10 w-32 mb-8" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full" />
          </aside>
          <main className="flex-1 ml-64">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Skeleton className="h-12 w-48 mb-4" />
              <Skeleton className="h-6 w-96 mb-12" />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header posts={posts} />
      <div className="flex">
        <Sidebar posts={posts} currentSlug={currentSlug} />
        <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
          {postLoading ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          ) : currentPost ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <BlogPost post={currentPost} />
            </div>
          ) : (
            <BlogList posts={posts} />
          )}
        </main>
      </div>
    </div>
  );
}

