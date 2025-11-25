import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface BlogFile {
  filePath: string;
  relativePath: string;
  category: string | null;
}

function getAllMarkdownFiles(
  dir: string,
  baseDir: string,
  files: BlogFile[] = []
): BlogFile[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      getAllMarkdownFiles(fullPath, baseDir, files);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".md") || entry.name.endsWith(".mdx"))
    ) {
      // Extract category from folder structure
      // If file is in a subdirectory, use that directory name as category
      const relativeDir = path.dirname(relativePath);
      const category =
        relativeDir === "." ? null : path.basename(relativeDir);

      files.push({
        filePath: fullPath,
        relativePath,
        category,
      });
    }
  }

  return files;
}

export async function GET() {
  try {
    const blogsDirectory = path.join(process.cwd(), "src/blogs");

    // Check if directory exists
    if (!fs.existsSync(blogsDirectory)) {
      return NextResponse.json([]);
    }

    // Get all markdown files recursively
    const blogFiles = getAllMarkdownFiles(blogsDirectory, blogsDirectory);

    // Parse each markdown file
    const posts = blogFiles.map(({ filePath, relativePath, category }) => {
      const fileContents = fs.readFileSync(filePath, "utf8");

      // Parse frontmatter and content
      const { data, content } = matter(fileContents);

      // Generate slug from relative path (without extension)
      const slug = relativePath.replace(/\.(md|mdx)$/, "").replace(/\//g, "-");

      // Create blog post object
      return {
        id: slug,
        slug,
        title: data.title || path.basename(relativePath, path.extname(relativePath)),
        description: data.description || "",
        author: data.author || "Anonymous",
        authorImage: data.authorImage || "",
        authorLink: data.authorLink || "",
        published_at: data.published_at || data.publishedAt || new Date().toISOString(),
        created_at: data.created_at || data.createdAt || new Date().toISOString(),
        updated_at: data.updated_at || data.updatedAt || new Date().toISOString(),
        category: category || undefined,
        content, // Include content for later use
      };
    });

    // Sort by published date (newest first)
    posts.sort(
      (a, b) =>
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return NextResponse.json(
      { error: "Failed to load blog posts" },
      { status: 500 }
    );
  }
}

