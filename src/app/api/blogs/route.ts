import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET() {
  try {
    const blogsDirectory = path.join(process.cwd(), "src/blogs");

    // Check if directory exists
    if (!fs.existsSync(blogsDirectory)) {
      return NextResponse.json([]);
    }

    // Read all files in the blogs directory
    const filenames = fs.readdirSync(blogsDirectory);

    // Filter for markdown files
    const markdownFiles = filenames.filter(
      (filename) => filename.endsWith(".md") || filename.endsWith(".mdx")
    );

    // Parse each markdown file
    const posts = markdownFiles.map((filename) => {
      const filePath = path.join(blogsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");

      // Parse frontmatter and content
      const { data, content } = matter(fileContents);

      // Generate slug from filename
      const slug = filename.replace(/\.(md|mdx)$/, "");

      // Create blog post object
      return {
        id: slug,
        slug,
        title: data.title || slug,
        description: data.description || "",
        author: data.author || "Anonymous",
        authorImage: data.authorImage || "",
        authorLink: data.authorLink || "",
        published_at: data.published_at || new Date().toISOString(),
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
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

