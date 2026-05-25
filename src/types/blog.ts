export interface TocSection {
  id: string;
  title: string;
}

export interface BlogPostMeta {
  id: number;
  slug: string;
  image: string;
  category: string;
  title: string;
  excerpt: string;
  toc: TocSection[];
}

export interface BlogPost extends Omit<BlogPostMeta, "id"> {
  content: React.ReactNode;
}
