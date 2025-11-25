export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  author: string;
  authorImage: string;
  authorLink: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}
