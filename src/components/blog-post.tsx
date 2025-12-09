"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { TableOfContents } from "@/components/table-of-contents";
import { ImageModal } from "@/components/image-modal";
import { extractHeadings } from "@/lib/markdown";
import { Skeleton } from "./ui/skeleton";
import type { BlogPost as BlogPostType, Heading } from "@/types/blog";

interface BlogPostProps {
  post: BlogPostType;
}

// 🧩 Utility: Parse heading text and custom ID if {id=...} is present
function parseHeading(children: React.ReactNode) {
  const raw = Array.isArray(children)
    ? children.join(" ")
    : children?.toString() || "";

  // Match `{id="something"}` or `{id=something}`
  const match = raw.match(/\{(?:#|id=)"?([a-zA-Z0-9_-]+)"?\}/);
  const cleanText = raw
    .replace(/\s*\{(?:#|id=)"?[a-zA-Z0-9_-]+"?\}\s*/, "")
    .trim();
  const id = match
    ? match[1]
    : cleanText.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return { text: cleanText, id };
}

export function BlogPost({ post }: BlogPostProps) {
  const [content, setContent] = useState<string>("");
  const [parsedHeadings, setParsedHeadings] = useState<Heading[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const markdown = post.content;
        const headings = extractHeadings(markdown);
        const parsedHeadings = headings.map((heading) => {
          const { text, id } = parseHeading(heading.text);
          return { ...heading, text, id };
        });

        setContent(markdown);
        setParsedHeadings(parsedHeadings);
      } catch (error) {
        console.error("Error loading markdown:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [post.slug]);

  // 🧭 Scroll to hash on page load
  useEffect(() => {
    if (!content || loading) return;
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [loading, content]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
        <article className="min-w-0">
          <header className="mb-8 pb-8 border-b border-border">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Image
                src={post.authorImage}
                alt={post.author}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span
                className="font-medium text-foreground hover:underline cursor-pointer"
                onClick={() => window.open(post.authorLink, "_blank")}
              >
                {post.author}
              </span>
              <span>•</span>
              <time>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            {post.description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {post.description}
              </p>
            )}
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Links open in new tab
                a: ({ ...props }) => {
                  // Check if it's an internal link (starts with /?post=)
                  const href = props.href || "";
                  const isInternalLink = href.startsWith("/?post=");
                  
                  if (isInternalLink) {
                    return (
                      <a
                        {...props}
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = href;
                        }}
                        className="text-primary hover:underline cursor-pointer"
                      />
                    );
                  }
                  
                  return (
                    <a
                      {...props}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    />
                  );
                },

                // Headings with custom ID support
                h1: ({ children, ...props }) => {
                  const { text, id } = parseHeading(children);
                  return (
                    <h1 id={id} className="scroll-mt-20" {...props}>
                      {text}
                    </h1>
                  );
                },
                h2: ({ children, ...props }) => {
                  const { text, id } = parseHeading(children);
                  return (
                    <h2 id={id} className="scroll-mt-20" {...props}>
                      {text}
                    </h2>
                  );
                },
                h3: ({ children, ...props }) => {
                  const { text, id } = parseHeading(children);
                  return (
                    <h3 id={id} className="scroll-mt-20" {...props}>
                      {text}
                    </h3>
                  );
                },
                h4: ({ children, ...props }) => {
                  const { text, id } = parseHeading(children);
                  return (
                    <h4 id={id} className="scroll-mt-20" {...props}>
                      {text}
                    </h4>
                  );
                },
                h5: ({ children, ...props }) => {
                  const { text, id } = parseHeading(children);
                  return (
                    <h5 id={id} className="scroll-mt-20" {...props}>
                      {text}
                    </h5>
                  );
                },
                h6: ({ children, ...props }) => {
                  const { text, id } = parseHeading(children);
                  return (
                    <h6 id={id} className="scroll-mt-20" {...props}>
                      {text}
                    </h6>
                  );
                },

                // Inline & block code
                code: ({ className, children, ...props }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children, ...props }) => (
                  <pre
                    className="bg-muted p-4 rounded-lg overflow-x-auto border border-border"
                    {...props}
                  >
                    {children}
                  </pre>
                ),

                // Images with shadow and rounded corners
                img: ({ src, alt, title, ...props }) => {
                  const imageSrc = typeof src === "string" ? src : "";
                  
                  // Parse scale from title attribute (e.g., "scale=1.5")
                  let scale = 1.0;
                  let imageTitle = title;
                  
                  if (title && typeof title === "string") {
                    const scaleMatch = title.match(/scale=([\d.]+)/i);
                    if (scaleMatch) {
                      scale = parseFloat(scaleMatch[1]);
                      // Remove scale from title if it exists
                      imageTitle = title.replace(/scale=[\d.]+/i, "").trim() || undefined;
                    }
                  }
                  
                  // Base width is 50% (w-1/2), apply scale multiplier
                  const widthPercent = Math.min(100, 50 * scale);
                  
                  return (
                    <img
                      src={imageSrc}
                      alt={alt || ""}
                      title={imageTitle}
                      style={{ width: `${widthPercent}%` }}
                      className="shadow-md rounded-lg my-4 h-auto transition-transform duration-300 hover:scale-[1.3] cursor-pointer"
                      onClick={() => setModalImage({ src: imageSrc, alt: alt || "" })}
                      {...props}
                    />
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <TableOfContents headings={parsedHeadings} />
          </div>
        </aside>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          isOpen={!!modalImage}
          imageSrc={modalImage.src}
          imageAlt={modalImage.alt}
          onClose={() => setModalImage(null)}
        />
      )}
    </div>
  );
}
