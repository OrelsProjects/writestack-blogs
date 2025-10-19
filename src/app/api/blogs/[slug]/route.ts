import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const blogsDirectory = path.join(process.cwd(), "src/blogs");

    // Try both .md and .mdx extensions
    let filePath = path.join(blogsDirectory, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(blogsDirectory, `${slug}.mdx`);
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return NextResponse.json({
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

