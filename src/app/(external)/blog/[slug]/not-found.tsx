"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const MotionLink = motion.create(Link);

export default function BlogNotFound() {
  return (
    <main className="relative flex grow flex-col items-center justify-center overflow-x-hidden bg-surface-10 px-4 py-12 text-center text-foreground selection:bg-amber-10 selection:text-amber-800">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: [0, -15, 0], opacity: 1 }}
        transition={{
          y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 1, ease: "easeOut" },
        }}
        className="relative mb-8 aspect-4/3 w-full max-w-137.5"
      >
        <Image
          src="/images/404-illustration.png"
          alt="404 Page Not Found Illustration"
          fill
          sizes="(max-width: 768px) 100vw, 550px"
          className="object-contain"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <h1 className="text-2xl font-bold tracking-tight text-dark-text">
          Oops! Page not found.
        </h1>

        <Button
          asChild
          className="bg-[#0F1C2E] hover:bg-[#1A2E48] text-white px-10 py-6 text-base font-medium rounded-md shadow-sm transition-colors duration-200"
        >
          <MotionLink
            href="/blog"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Back To Blog
          </MotionLink>
        </Button>
      </motion.div>
    </main>
  );
}
