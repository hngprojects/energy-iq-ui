"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WaitlistService } from "@/services/waitlist-service";

const blogPosts = [
  { id: 1, image: "/images/how_it_works_1.jpg" },
  { id: 2, image: "/images/how_it_works_2.jpg" },
  { id: 3, image: "/images/how_it_works_3.jpg" },
  { id: 4, image: "/images/journey.jpg" },
  { id: 5, image: "/images/panels.jpg" },
  { id: 6, image: "/images/hero-img.jpg" },
  { id: 7, image: "/images/services_1.jpg" },
  { id: 8, image: "/images/services_2.jpg" },
  { id: 9, image: "/images/services_3.jpg" },
];

export default function Blog() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleSubscribe = async () => {
    if (isLoading) return;
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      toast.error("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      await WaitlistService.joinWaitlist(normalizedEmail);
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : "Failed to subscribe. Please try again.";
      toast.error(message, { description: "Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col bg-white">
      {/* Scroll progress bar */}
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <div className="bg-secondary relative h-75 w-full overflow-hidden md:h-100">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/pages.jpg')" }}
        />
        <div className="from-secondary/40 via-secondary/60 to-secondary absolute inset-0 z-10 bg-linear-to-b" />

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-3xl font-bold tracking-tight text-white md:text-5xl"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="max-w-3xl text-base text-slate-50 md:text-lg"
          >
            Built to solve Nigeria&apos;s energy visibility problem.
          </motion.p>
        </div>
      </div>

      {/* Blog Grid Section */}
      <div className="mx-auto w-full max-w-300.25 px-4 pb-20 pt-20 sm:px-6 lg:px-0">
        <div className="grid grid-cols-1 gap-14.5 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="flex cursor-pointer flex-col overflow-hidden rounded-lg"
            >
              {/* Image */}
              <div className="relative h-58.75 w-full overflow-hidden rounded-lg">
                <Image
                  src={post.image}
                  alt="Reducing Waste and Embracing Sustainability"
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Text */}
              <div className="flex h-13 items-center">
                <p className="line-clamp-2 text-sm font-medium text-[#1A1F2C] md:text-base">
                  Reducing Waste and Embracing Sustainability
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mx-auto w-full max-w-300.25 px-4 pb-20 sm:px-6 lg:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex w-full flex-col items-center rounded-lg bg-[#1A1F2C] px-6 pb-20 pt-20 text-center sm:px-12 lg:px-20"
        >
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-white md:text-4xl lg:text-[48px] lg:leading-tight"
          >
            Sign Up for the Latest Insights
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6.5 max-w-145 text-base font-light text-white md:text-[18px] md:leading-relaxed"
          >
            Get free access to our exclusive research and tech strategies to
            level{" "}
            <br className="hidden lg:block" />
            up your knowledge about the digital realm
          </motion.p>

          {/* Email input + button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14.75 flex max-w-md items-center gap-2 rounded-xl bg-white p-1.5 focus-within:ring-2 focus-within:ring-[#F5A623]"
          >
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              className="w-full border-none bg-transparent px-4 py-2 text-[#1A1F2C] placeholder:text-gray-400 focus-visible:ring-0 disabled:opacity-50"
            />
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="rounded-lg bg-[#F5A623] px-6 py-2 font-bold text-[#1A1F2C] transition-colors hover:bg-[#E59513] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
