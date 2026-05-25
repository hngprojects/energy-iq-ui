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

export interface CitationLink {
  label: string;
  href: string;
}

export type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "italic"; text: string }
  | { type: "closing"; text: string }
  | { type: "divider" }
  | { type: "ul"; items: (string | { text: string; children?: string[] })[] }
  | { type: "table"; headers: [string, string]; rows: [string, string][] }
  | { type: "blockquote"; text: string; citation?: CitationLink }
  | { type: "card-grid"; cards: { title: string; items: string[]; note?: string; noteLink?: string }[] }
  | { type: "challenge-list"; items: { title: string; desc: string }[] };

export interface BlogSection {
  id: string;
  blocks: ContentBlock[];
}

export interface BlogPostContent {
  sections: BlogSection[];
}
