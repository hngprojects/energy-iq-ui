import Blog from "@/components/external/blog";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | EnergyIQ",
  description: "Read the latest news and updates from EnergyIQ.",
};

export default function BlogPage() {
  return (
    <div className="flex w-full flex-col">
      <Blog />
    </div>
  );
}
