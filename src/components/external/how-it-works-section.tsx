"use client";

import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

interface StepCardProps {
  title: string;
  description: string;
  image: string;
  index: number;
}

const StepCard = ({ title, description, image, index }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
      className="group overflow-hidden rounded-[12px] bg-[#111928] shadow-xl"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-8 pb-12">
        <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export const HowItWorksSection = () => {
  const steps = [
    {
      title: "Select your Inverter type",
      description: "Choose your brand and connect in minutes.",
      image: "/images/how_it_works_1.png",
    },
    {
      title: "Connect your Inverter",
      description:
        "Securely link your inverter to Energy IQ. It takes less than 5 min.",
      image: "/images/how_it_works_2.png",
    },
    {
      title: "Move to Dashboard",
      description:
        "Once connected, everything comes into one clean dashboard, so you stop switching between apps.",
      image: "/images/how_it_works_3.png",
    },
  ];

  return (
    <section className="section-padding text-foreground w-full bg-[#F7F7F799] py-16 md:py-24 mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-center"
      >
        <h2 className="max-w-xl text-[32px] leading-tight font-bold md:text-[48px]">
          How it <span className="text-primary">Works</span>
        </h2>

        <Link href="/how-it-works">
          <Button
            size="lg"
            className="bg-primary text-secondary hover:bg-primary/90 w-fit rounded-xl px-8 font-bold"
          >
            Show More
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <StepCard
            key={index}
            index={index}
            title={step.title}
            description={step.description}
            image={step.image}
          />
        ))}
      </div>
    </section>
  );
};
