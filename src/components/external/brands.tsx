"use client";
import { motion } from "motion/react";
import Image from "next/image";

const logos = [
  { src: "/images/logo1.svg", alt: "Logoipsum" },
  { src: "/images/logo2.svg", alt: "Quantum" },
  { src: "/images/logo3.svg", alt: "Hexalink" },
  { src: "/images/logo4.svg", alt: "Apex" },
  { src: "/images/logo5.svg", alt: "Logoipsum 2" },
  { src: "/images/logo6.svg", alt: "Bubbles" },
  { src: "/images/logo7.svg", alt: "Predator" },
  { src: "/images/logo8.svg", alt: "Brand Standard" },
];

export function WorksWith() {
  return (
    <section className="w-full bg-[#F9FAFBA6]/65 py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-secondary mb-10 text-center text-sm font-semibold tracking-wide uppercase md:text-base">
          Works with
        </p>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            className="flex w-max items-center py-4"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="mx-6 flex shrink-0 items-center justify-center md:mx-12"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={150}
                  height={40}
                  className="h-8 w-auto opacity-70 transition-opacity hover:opacity-100 md:h-14"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
