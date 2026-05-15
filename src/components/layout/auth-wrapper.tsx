"use client";
import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import { ReactNode } from "react";

const AuthShape = "/images/auth-shape.png";
const AuthShapeMobile = "/images/wave.png";

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-hidden bg-white px-6 pb-12 xl:px-20.25">
      <div className="pointer-events-none absolute bottom-0 left-0 hidden lg:block">
        <Image
          src={AuthShape}
          alt=""
          width={1000}
          height={1000}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
      <div className="pointer-events-none absolute top-0 left-0 w-32 md:w-48 lg:hidden">
        <Image
          src={AuthShapeMobile}
          alt=""
          width={400}
          height={400}
          className="h-auto w-full object-contain"
          priority
        />
      </div>
      <div className="absolute top-12 left-1/2 z-20 -translate-x-1/2 lg:top-16.5 lg:left-20.25 lg:translate-x-0">
        <Logo size="lg" />
      </div>
      <div className="relative z-10 w-full max-w-120">{children}</div>
    </div>
  );
}
