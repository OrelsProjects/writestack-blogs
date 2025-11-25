"use client";

import { useEffect, useState } from "react";
import { BlogPost } from "@/components/blog-post";
import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost as BlogPostType } from "@/types/blog";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPage({ params }: BlogPageProps) {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const getSlug = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getSlug();
  }, [params]);

  useEffect(() => {
    // Load all posts for search
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (response.ok) {
          const data = await response.json();
          setPosts(data || []);
        }
      } catch (error) {
        console.error("Error loading posts:", error);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blogs/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch blog post");
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header posts={posts} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header posts={posts} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold">Blog post not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header posts={posts} />
      <BlogPost post={post} />
    </div>
  );
}

