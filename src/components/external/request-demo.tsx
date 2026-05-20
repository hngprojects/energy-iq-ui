"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const badges = [
  {
    title: "Monitor your solar",
    description: "View real-time data on your dashboard",
    image: "/images/request_demo_1.jpg",
    video: "https://res.cloudinary.com/dvpflqeev/video/upload/q_auto/f_auto/v1779286816/4034091-hd_1920_1080_30fps_zok0pk.mp4",
    heading: "Smart Energy, Smarter Business",
  },
  {
    title: "Connect with multiple brands",
    description: "Connection to multiple brands.",
    image: "/images/request_demo_2.jpg",
    video: "https://res.cloudinary.com/dvpflqeev/video/upload/q_auto/f_auto/v1779286811/12717359_1920_1080_60fps_xk4mxb.mp4",
    heading: "Seamless Integration, Global Reach",
  },
  {
    title: "Today world of Solar",
    description: "Solar Energy in modern society.",
    image: "/images/request_demo_3.jpg",
    video: "https://res.cloudinary.com/dvpflqeev/video/upload/q_auto/f_auto/v1779287421/15261867-hd_1920_1080_24fps_i6agst.mp4",
    heading: "Powering the Future of Energy",
  },
];

interface DemoBadgeProps {
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  onClick: () => void;
}

const DemoBadge = ({ title, description, image, isActive, onClick }: DemoBadgeProps) => {
  return (
    <div 
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-4 rounded-[12px] p-4 shadow-xl transition-all duration-300 ${
        isActive ? "bg-white ring-2 ring-primary" : "bg-white/90 hover:bg-white"
      }`}
    >
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="section-padding text-foreground bg-[#F7F7F799] py-16 md:py-24">
      <div className="container-padding mx-auto w-full max-w-7xl">
        <div className="relative isolate flex min-h-[400px] flex-col justify-between overflow-hidden rounded-[8px] p-6 md:min-h-[730px] md:p-11">
          <AnimatePresence mode="popLayout">
            {activeIndex === null ? (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src="/images/request_demo_bg.png"
                  alt="Request a demo background"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#0D1624]/50" />
              </motion.div>
            ) : (
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 z-0"
              >
                <video
                  key={badges[activeIndex].video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                >
                  <source src={badges[activeIndex].video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#0D1624]/50" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-6">
              <motion.h2 
                key={activeIndex ?? "default"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl text-[34px] leading-tight font-bold tracking-tight text-white md:text-[48px]"
              >
                {activeIndex === null ? (
                  <>
                    Smart Energy, <br className="hidden md:block" />
                    Smarter Business
                  </>
                ) : (
                  badges[activeIndex].description.split(", ").map((text, i) => (
                    <React.Fragment key={i}>
                      {text}{i === 0 && <> <br className="hidden md:block" /></>}
                    </React.Fragment>
                  ))
                )}
              </motion.h2>
            </div>
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
                  isActive={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
