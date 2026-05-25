"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import BlogPostContent from "@/components/external/blog-posts/blog-post-content";

export type { BlogPost };

interface BlogPostDetailProps {
  post: BlogPost;
}

export default function BlogPostDetail({ post }: BlogPostDetailProps) {
  const [activeSection, setActiveSection] = useState(
    post.toc[0]?.id ?? "",
  );
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length > 0) {
        setActiveSection(intersecting[0].target.id);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    post.toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [post.toc]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = el.getBoundingClientRect().top;
    window.scrollTo({
      top: elementRect - bodyRect - offset,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-background selection:bg-amber-10 min-h-screen font-sans selection:text-amber-800">
      {/* Scroll progress bar */}
      <motion.div
        className="bg-primary fixed top-0 right-0 left-0 z-50 h-1.5 origin-left"
        style={{ scaleX }}
      />

      {/* Hero banner */}
      <header className="bg-secondary relative h-75 w-full overflow-hidden md:h-100">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="from-secondary/40 via-secondary/60 to-secondary absolute inset-0 z-10 bg-gradient-to-b" />

        <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
          {/* Category badge */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-primary text-primary-foreground mb-4 inline-block rounded-full px-4 py-1 text-xs font-semibold"
          >
            {post.category}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-4 max-w-3xl text-2xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl"
          >
            {post.title}
          </motion.h1>
        </div>
      </header>

      {/* Body */}
      <div className="bg-white">
        <main className="container mx-auto max-w-350 px-4 py-16 md:px-6 lg:px-8">

          {/* Back link — always visible on all screen sizes */}
          <Link
            href="/blog"
            className="text-slate-70 hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Blog
          </Link>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-start">

            {/* ── Sidebar TOC ── */}
            <aside className="hidden lg:block lg:sticky lg:top-24 lg:w-1/4">
              <div className="border-none bg-white shadow-none lg:bg-transparent lg:p-0">
                <h2 className="mb-6 text-lg font-bold tracking-wider text-slate-900 uppercase lg:text-xl">
                  Table of Contents
                </h2>

                <nav className="flex flex-col space-y-1">
                  {post.toc.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "group flex items-center border-l-2 py-2.5 pl-4 text-left text-sm transition-all duration-200",
                        activeSection === section.id
                          ? "border-primary bg-amber-10 text-primary font-semibold"
                          : "border-slate-30 text-slate-70 hover:bg-slate-10 hover:border-slate-50 hover:text-slate-100",
                      )}
                    >
                      <span
                        className={cn(
                          "transition-transform duration-200 group-hover:translate-x-1",
                          activeSection === section.id && "translate-x-1",
                        )}
                      >
                        {section.title}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── Article content ── */}
            <div className="w-full lg:w-3/4 lg:pl-8">
              <BlogPostContent content={post.content} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
