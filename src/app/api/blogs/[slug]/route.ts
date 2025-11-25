import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

function findBlogFile(
  dir: string,
  baseDir: string,
  targetSlug: string
): { filePath: string; category: string | null } | null {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      const result = findBlogFile(fullPath, baseDir, targetSlug);
      if (result) return result;
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
    ) {
      // Generate slug from relative path (same logic as in route.ts)
      const fileSlug = relativePath
        .replace(/\.(md|mdx)$/, "")
        .replace(/\//g, "-");

      if (fileSlug === targetSlug) {
        const relativeDir = path.dirname(relativePath);
        const category =
          relativeDir === "." ? null : path.basename(relativeDir);

        return {
          filePath: fullPath,
          category,
        };
      }
    }
  }

  return null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blogsDirectory = path.join(process.cwd(), "src/blogs");

    // Search recursively for the file matching the slug
    const result = findBlogFile(blogsDirectory, blogsDirectory, slug);

    if (!result) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(result.filePath, "utf8");
    const { data, content } = matter(fileContents);

    return NextResponse.json({
      id: slug,
      slug,
      title: data.title || slug,
      description: data.description || "",
      author: data.author || "Anonymous",
      authorImage: data.authorImage || "",
      authorLink: data.authorLink || "",
      published_at: data.published_at || data.publishedAt || new Date().toISOString(),
      created_at: data.created_at || data.createdAt || new Date().toISOString(),
      updated_at: data.updated_at || data.updatedAt || new Date().toISOString(),
      category: result.category || undefined,
      content,
    });
  } catch (error) {
    console.error("Error reading blog post:", error);
    return NextResponse.json(
      { error: "Failed to load blog post" },
      { status: 500 }
    );
  }
}

