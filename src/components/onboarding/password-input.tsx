"use client";

import { useState, InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        className={cn(
          "h-14 rounded-lg border-[#D8DBE299] bg-[#FCFCFC] pr-11 text-base placeholder:text-[#9CA3AF] focus-within:bg-white lg:text-lg",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide value" : "Show value"}
        className="absolute top-1/2 right-7 -translate-y-1/2 cursor-pointer text-[#343330] hover:text-gray-800"
      >
        <HugeiconsIcon
          icon={show ? ViewIcon : ViewOffIcon}
          className="size-4"
        />
      </button>
    </div>
  );
}
