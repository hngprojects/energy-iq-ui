"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Navbar } from "@/components/external/nav-bar";
import { Button } from "@/components/ui/button";

// Create an animated version of Next.js Link
const MotionLink = motion.create(Link);

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-surface-10 text-foreground selection:bg-amber-10 selection:text-amber-800">
      <Navbar />

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-0 bottom-0 top-[10%] w-[30vw] max-w-100 pointer-events-none z-0 hidden md:block"
      >
        <div className="pointer-events-none absolute bottom-0 left-0 hidden lg:block">
          <Image
            src="/images/auth-shape-mobile.png"
            alt=""
            width={1000}
            height={1000}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </motion.div>

      <main className="grow flex flex-col items-center justify-center px-4 py-12 z-10 text-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{
            y: [0, -15, 0],
            opacity: 1,
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: 1,
              ease: "easeOut",
            },
          }}
          className="relative w-full max-w-137.5 aspect-4/3 mb-8"
        >
          <Image
            src="/images/404-illustration.png"
            alt="404 Page Not Found Illustration"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <h1 className="text-2xl font-bold text-dark-text mb-6 tracking-tight">
            Oops! Page not found.
          </h1>

          {/* Corrected: Button passes props directly to MotionLink */}
          <Button
            asChild
            className="bg-[#0F1C2E] hover:bg-[#1A2E48] text-white px-10 py-6 text-base font-medium rounded-md shadow-sm transition-colors duration-200"
          >
            <MotionLink
              href="/"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              Back To Home
            </MotionLink>
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
