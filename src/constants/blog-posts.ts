import type { BlogPostMeta, BlogPostContent } from "@/types/blog";
import { BLOG_POST_CONTENTS } from "@/constants/blog-post-contents";

export interface BlogPostEntry extends BlogPostMeta {
  content: BlogPostContent;
}

export const BLOG_POSTS: BlogPostEntry[] = [
  {
    id: 1,
    slug: "how-to-choose-energy-efficient-appliance",
    image: "/images/how_it_works_1.jpg",
    category: "Solar & Inverter",
    title: "How To Choose An Energy Efficient Appliance For Your Solar Inverter",
    excerpt:
      "You finally invest in a solar setup but it drains faster than expected. In most cases, the appliances connected to it are the real issue. Here is how to choose the right ones.",
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
    content: BLOG_POST_CONTENTS["how-to-choose-energy-efficient-appliance"],
  },
  {
    id: 2,
    slug: "understanding-power-consumption-in-homes",
    image: "/images/how_it_works_2.jpg",
    category: "Energy Tips",
    title: "Understanding Power Consumption In Homes",
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
    content: BLOG_POST_CONTENTS["understanding-power-consumption-in-homes"],
  },
  {
    id: 3,
    slug: "how-ai-improves-energy-management-systems",
    image: "/images/how_it_works_3.jpg",
    category: "AI & Technology",
    title: "How AI Improves Your Energy Management Systems",
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
    content: BLOG_POST_CONTENTS["how-ai-improves-energy-management-systems"],
  },
];
