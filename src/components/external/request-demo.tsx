"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
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
  isPlaying: boolean;
  onClick: () => void;
}

const DemoBadge = ({ title, description, image, isActive, isPlaying, onClick }: DemoBadgeProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      className={`flex cursor-pointer items-center gap-3 rounded-[12px] p-3 shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-4 sm:p-4 ${
        isActive ? "bg-white ring-2 ring-primary" : "bg-white/90 hover:bg-white"
      }`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <Image src={image} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
            {isActive && isPlaying ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold text-[#525252] sm:text-base lg:text-[18px]">{title}</h3>
        <p className="text-xs leading-tight text-[#525252] sm:text-sm lg:text-[16px]">{description}</p>
      </div>
    </div>
  );
};

export const RequestDemo = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || activeIndex === null || videoError) return;
    video.src = badges[activeIndex].video;
    video.load();
    video.play().catch(() => {});
  }, [activeIndex, videoError]);

  const handleBadgeClick = (index: number) => {
    if (activeIndex === index) {
      if (videoError) {
        setVideoError(false);
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    } else {
      setVideoError(false);
      setActiveIndex(index);
    }
  };

  return (
    <section className="text-foreground bg-[#F7F7F799] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative isolate flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[8px] p-5 md:min-h-[620px] md:p-8 lg:min-h-[730px] lg:p-11">

          {/* Background — always mounted, never remounts */}
          <div className="absolute inset-0 z-0">
            {/* Static background image shown when no video selected */}
            <motion.div
              animate={{ opacity: activeIndex === null ? 1 : 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <Image
                src="/images/request_demo_bg.png"
                alt="Request a demo background"
                fill
                priority
                className="object-cover"
              />
            </motion.div>

            {/* Single persistent video element — src swapped via useEffect */}
            {!videoError && (
              <motion.video
                ref={videoRef}
                loop
                muted
                playsInline
                animate={{ opacity: activeIndex !== null ? 1 : 0 }}
                transition={{ duration: 1 }}
                aria-label="Video demonstration"
                className="h-full w-full object-cover"
                onError={() => setVideoError(true)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}

            {/* Fallback image on video error */}
            {videoError && activeIndex !== null && (
              <Image
                src={badges[activeIndex].image}
                alt={badges[activeIndex].title}
                fill
                className="object-cover"
              />
            )}

            <div className="absolute inset-0 bg-[#0D1624]/50" />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="space-y-6">
              <motion.h2
                key={activeIndex ?? "default"}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl text-2xl leading-tight font-bold tracking-tight text-white sm:text-[34px] lg:text-[48px]"
              >
                {activeIndex === null ? (
                  <>Smart Energy, Smarter Business</>
                ) : (
                  badges[activeIndex].heading.split(", ").map((text, i) => (
                    <React.Fragment key={i}>
                      {text}
                      {i === 0 && badges[activeIndex].heading.includes(", ") && (
                        <> <br className="hidden lg:block" /></>
                      )}
                    </React.Fragment>
                  ))
                )}
              </motion.h2>
            </div>
          </div>

          <div className="no-scrollbar relative z-10 flex snap-x gap-3 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-x-visible lg:pb-0">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="w-[82%] shrink-0 snap-center sm:w-[58%] lg:w-full"
              >
                <DemoBadge
                  title={badge.title}
                  description={badge.description}
                  image={badge.image}
                  isActive={activeIndex === index}
                  isPlaying={isPlaying}
                  onClick={() => handleBadgeClick(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
