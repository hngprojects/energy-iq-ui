"use client";

import React from "react";
import { motion } from "motion/react";

import { Button } from "../ui/button";
import Image from "next/image";

interface DemoBadgeProps {
  title: string;
  description: string;
  image: string;
}

const DemoBadge = ({ title, description, image }: DemoBadgeProps) => {
  return (
    <div className="flex items-center gap-4 rounded-[12px] bg-white p-4 shadow-xl">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
        <Image src={image} alt={title} fill className="object-cover" />

        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-1 text-[18px] font-semibold text-[#525252]">
          {title}
        </h4>

        <p className="text-[16px] leading-tight text-[#525252]">
          {description}
        </p>
      </div>
    </div>
  );
};

export const RequestDemo = () => {
  const badges = [
    {
      title: "Monitor your solar",
      description: "View real-time data on your dashboard",
      image: "/images/request_demo_1.jpg",
    },
    {
      title: "Connect with multiple brands",
      description: "Connection to multiple brands.",
      image: "/images/request_demo_2.jpg",
    },
    {
      title: "Today world of Solar",
      description: "Solar Energy in modern society.",
      image: "/images/request_demo_3.jpg",
    },
  ];

  return (
    <section className="section-padding text-foreground bg-[#F7F7F799] py-16 md:py-24">
      <div className="container-padding mx-auto w-full max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="relative isolate flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[8px] p-6 md:min-h-[730px] md:p-11"
        >
          <Image
            src="/images/request_demo_bg.png"
            alt="Request a demo background"
            fill
            priority
            className="z-0 object-cover"
          />

          <div className="absolute inset-0 z-1 bg-[#0D1624]/50" />
          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-6">
              <h2 className="max-w-2xl text-[34px] leading-tight font-bold tracking-tight text-white md:text-[48px]">
                Smart Energy, <br className="hidden md:block" />
                Smarter Business
              </h2>
              <Button
                size="lg"
                className="bg-primary text-secondary hover:bg-primary/90 h-12 rounded-xl px-8 font-bold md:hidden"
              >
                Request A Demo
              </Button>
            </div>

            <Button
              size="lg"
              className="bg-primary text-secondary hover:bg-primary/90 hidden h-14 rounded-xl px-10 font-bold md:flex"
            >
              Request A Demo
            </Button>
          </div>
          <div className="no-scrollbar relative z-10 flex snap-x gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-[92%] shrink-0 snap-center md:w-full"
              >
                <DemoBadge
                  title={badge.title}
                  description={badge.description}
                  image={badge.image}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
