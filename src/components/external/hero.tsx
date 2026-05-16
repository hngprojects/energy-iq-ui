"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="w-full px-4 pt-2 pb-10 md:px-8 md:pt-4 md:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="bg-foreground relative overflow-hidden rounded-2xl md:rounded-3xl">
          <Image
            src="/images/hero-img.jpg"
            alt="Modern energy-efficient glass building"
            className="absolute inset-0 h-full w-full object-cover"
            fill
            priority
          />

          <div className="from-foreground/80 via-foreground/40 to-foreground/10 md:from-foreground/85 md:via-foreground/55 absolute inset-0 bg-linear-to-b md:bg-linear-to-r md:to-transparent" />

          <div className="relative flex min-h-[500px] flex-col justify-center px-4 md:min-h-130 md:px-12 lg:px-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-background ml-0 max-w-2xl md:ml-2 lg:ml-4"
            >
              <h1 className="font-display text-3xl leading-[1.15] font-bold tracking-tight md:text-7xl lg:text-[3.5rem]">
                One Dashboard For
                <br />
                Your Energy System
              </h1>

              <p className="mt-4 max-w-md text-base text-white/80 md:mt-5 md:text-2xl">
                Empower your business with real time data and smart power
                choices.
              </p>

              <div className="mt-7 md:mt-8">
                <Button
                  size="lg"
                  className="bg-primary text-foreground hover:bg-primary/80 h-11 rounded-md px-7 font-medium"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>

                {/* <Button
                  size="lg"
                  className="bg-primary text-foreground hover:bg-primary/90 hidden h-12 rounded-md px-7 font-medium md:inline-flex"
                >
                  <Link href="/login">Contact Us</Link>
                </Button> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="absolute right-8 bottom-5 left-14 translate-x-4 sm:left-auto sm:w-62 md:right-8 md:bottom-8 md:w-84"
            >
              <div className="bg-background flex items-center gap-3 rounded-xl px-2 py-2 shadow-2xl md:rounded-2xl md:px-5 md:py-6">
                <Image
                  src="/images/worker.png"
                  alt="Engineer"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-lg object-cover md:h-24 md:w-24"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <Image
                        src="/images/avatar1.png"
                        alt="a1"
                        width={32}
                        height={32}
                        className="border-background h-8 w-8 rounded-full border-2 object-cover"
                      />
                      <Image
                        src="/images/avatar2.png"
                        alt="a2"
                        width={32}
                        height={32}
                        className="border-background h-8 w-8 rounded-full border-2 object-cover"
                      />
                      <Image
                        src="/images/avatar3.png"
                        alt="a3"
                        width={32}
                        height={32}
                        className="border-background h-8 w-8 rounded-full border-2 object-cover"
                      />
                    </div>

                    <p className="font-display text-foreground text-xl font-bold md:text-2xl">
                      300+
                    </p>
                  </div>

                  <p className="text-foreground/70 mt-1 text-xs md:text-sm">
                    SME business owners and installers across Africa
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
