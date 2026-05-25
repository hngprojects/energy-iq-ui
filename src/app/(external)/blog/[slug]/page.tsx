import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPostDetail from "@/components/external/blog-post-detail";
import type { BlogPost } from "@/types/blog";
import { BLOG_POSTS } from "@/constants/blog-posts";
import Post1Content from "@/components/external/blog-posts/post-1-content";
import Post2Content from "@/components/external/blog-posts/post-2-content";
import Post3Content from "@/components/external/blog-posts/post-3-content";

const contentMap: Record<string, () => React.ReactNode> = {
  "how-to-choose-energy-efficient-appliance": () => <Post1Content />,
  "understanding-power-consumption-in-homes": () => <Post2Content />,
  "how-ai-improves-energy-management-systems": () => <Post3Content />,
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

  const contentFn = contentMap[slug];
  if (!contentFn) notFound();

  const { id: _id, ...meta } = postMeta;
  const post: BlogPost = { ...meta, content: contentFn() };

  return (
    <div className="flex w-full flex-col">
      <BlogPostDetail post={post} />
    </div>
  );
}
