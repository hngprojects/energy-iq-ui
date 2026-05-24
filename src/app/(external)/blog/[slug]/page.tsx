import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogPostDetail, {
  BlogPost,
} from "@/components/external/blog-post-detail";
import Post1Content from "@/components/external/blog-posts/post-1-content";
import Post2Content from "@/components/external/blog-posts/post-2-content";
import Post3Content from "@/components/external/blog-posts/post-3-content";


const posts: Omit<BlogPost, "content">[] = [
  {
    slug: "how-to-choose-energy-efficient-appliance",
    title:
      "How To Choose An Energy Efficient Appliance For Your Solar Inverter",
    category: "Solar & Inverter",
    date: "May 20, 2025",
    readTime: "6 min read",
    image: "/images/how_it_works_1.jpg",
    excerpt:
      "You finally invest in a solar setup but it drains faster than expected. In most cases, the appliances connected to it are the real issue.",
    toc: [
      { id: "intro", title: "Introduction" },
      { id: "inverter-capacity", title: "1. Understand Your Inverter Capacity" },
      { id: "power-rating", title: "2. Check the Power Rating" },
      { id: "energy-efficient", title: "3. Prioritize Energy Efficient Appliances" },
      { id: "heating-appliances", title: "4. Avoid High Heating Appliances" },
      { id: "startup-power", title: "5. Consider Startup Power" },
      { id: "led-lighting", title: "6. Switch to LED Lighting" },
      { id: "long-term", title: "7. Think Long Term" },
      { id: "key-takeaways", title: "Key Takeaways" },
    ],
  },
  {
    slug: "understanding-power-consumption-in-homes",
    title: "Understanding Power Consumption In Homes",
    category: "Energy Tips",
    date: "May 24, 2025",
    readTime: "5 min read",
    image: "/images/how_it_works_2.jpg",
    excerpt:
      "In many homes, the problem is not just electricity supply — it is poor understanding of how much power everyday appliances actually consume.",
    toc: [
      { id: "intro", title: "Introduction" },
      { id: "what-power-means", title: "1. What Power Consumption Means" },
      { id: "high-power-appliances", title: "2. High Power Appliances" },
      { id: "usage-time", title: "3. Usage Time Matters" },
      { id: "energy-efficient", title: "4. Energy Efficient Appliances" },
      { id: "kilowatt-hours", title: "5. Understanding Kilowatt Hours" },
      { id: "phantom-power", title: "6. Phantom Power Is Real" },
      { id: "monitoring", title: "7. Monitoring Consumption" },
      { id: "key-takeaways", title: "Key Takeaways" },
    ],
  },
  {
    slug: "how-ai-improves-energy-management-systems",
    title: "How AI Improves Your Energy Management Systems",
    category: "AI & Technology",
    date: "May 24, 2025",
    readTime: "8 min read",
    image: "/images/how_it_works_3.jpg",
    excerpt:
      "AI-powered energy management systems are helping businesses cut costs, improve efficiency and reduce carbon emissions. Here is how.",
    toc: [
      { id: "intro", title: "Introduction" },
      { id: "what-is-ems", title: "What is an EMS?" },
      { id: "why-ai-matters", title: "Why AI Matters" },
      { id: "reduce-consumption", title: "1. Reduce Energy Consumption" },
      { id: "predict-demand", title: "2. Predict Energy Demand" },
      { id: "renewable-integration", title: "3. Renewable Energy Integration" },
      { id: "predictive-maintenance", title: "4. Predictive Maintenance" },
      { id: "reduce-costs", title: "5. Reduce Operational Costs" },
      { id: "smart-grids", title: "6. Stabilise Smart Grids" },
      { id: "sustainability", title: "7. Sustainability Goals" },
      { id: "real-world", title: "Real-World Applications" },
      { id: "challenges", title: "Challenges" },
      { id: "future", title: "The Future" },
      { id: "key-takeaways", title: "Key Takeaways" },
    ],
  },
];

const contentMap: Record<string, React.ReactNode> = {
  "how-to-choose-energy-efficient-appliance": <Post1Content />,
  "understanding-power-consumption-in-homes": <Post2Content />,
  "how-ai-improves-energy-management-systems": <Post3Content />,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found | EnergyIQ" };
  return {
    title: `${post.title} | EnergyIQ`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postMeta = posts.find((p) => p.slug === slug);
  if (!postMeta) notFound();

  const post: BlogPost = {
    ...postMeta,
    content: contentMap[slug] ?? null,
  };

  return (
    <div className="flex w-full flex-col">
      <BlogPostDetail post={post} />
    </div>
  );
}
