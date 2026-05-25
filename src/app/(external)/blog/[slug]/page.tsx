import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPostDetail from "@/components/external/blog-post-detail";
import BlogPostContent from "@/components/external/blog-posts/blog-post-content";
import type { BlogPost, BlogPostContent as BlogPostContentType } from "@/types/blog";
import { BLOG_POSTS } from "@/constants/blog-posts";
import { POST_1_CONTENT, POST_2_CONTENT, POST_3_CONTENT } from "@/constants/blog-post-contents";

const contentMap: Record<string, BlogPostContentType> = {
  "how-to-choose-energy-efficient-appliance": POST_1_CONTENT,
  "understanding-power-consumption-in-homes": POST_2_CONTENT,
  "how-ai-improves-energy-management-systems": POST_3_CONTENT,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found | EnergyIQ" };
  return {
    title: `${post.title} | EnergyIQ`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postMeta = BLOG_POSTS.find((p) => p.slug === slug);
  if (!postMeta) notFound();

  const postContent = contentMap[slug];
  if (!postContent) notFound();

  const { id: _id, ...meta } = postMeta;
  const post: BlogPost = {
    ...meta,
    content: <BlogPostContent content={postContent} />,
  };

  return (
    <div className="flex w-full flex-col">
      <BlogPostDetail post={post} />
    </div>
  );
}
