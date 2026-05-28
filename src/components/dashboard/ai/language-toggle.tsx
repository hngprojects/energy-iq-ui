"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/auth-store";
import { ProfileService } from "@/services/profile-service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { user, setUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const currentLanguage = React.useMemo(() => {
    const rawLang = user?.aiLanguage;
    if (rawLang) {
      const normalized = rawLang.toLowerCase();
      if (normalized === "pidgin" || normalized === "english") {
        return normalized;
      }
    }
    return "english";
  }, [user]);

  const handleLanguageChange = async (newLang: "english" | "pidgin") => {
    if (newLang === currentLanguage || isUpdating || !user) return;

    setIsUpdating(true);
    
    const originalUser = { ...user };

    setUser({
      ...user,
      aiLanguage: newLang,
    });

    try {
      await ProfileService.updateProfile({
        aiLanguage: newLang,
      });
    } catch (err) {
      console.error("[LanguageToggle] Failed to update language settings:", err);
      setUser(originalUser);
      toast.error("Failed to save language preference. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center rounded-lg bg-muted p-0.5 md:p-1 text-xs md:text-sm font-medium">
      <Button
        variant="ghost"
        size="xs"
        disabled={isUpdating}
        onClick={() => void handleLanguageChange("english")}
        className={cn(
          "relative h-auto rounded-md px-1.5 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs transition-all duration-200 cursor-pointer hover:bg-transparent",
          currentLanguage === "english"
            ? "bg-background text-foreground shadow-sm hover:bg-background"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent",
          isUpdating && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="hidden md:inline">English</span>
        <span className="inline md:hidden">EN</span>
      </Button>
      <Button
        variant="ghost"
        size="xs"
        disabled={isUpdating}
        onClick={() => void handleLanguageChange("pidgin")}
        className={cn(
          "relative h-auto rounded-md px-1.5 py-0.5 text-[10px] md:px-3 md:py-1 md:text-xs transition-all duration-200 cursor-pointer hover:bg-transparent",
          currentLanguage === "pidgin"
            ? "bg-background text-foreground shadow-sm hover:bg-background"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent",
          isUpdating && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="hidden md:inline">Pidgin</span>
        <span className="inline md:hidden">PG</span>
      </Button>
    </div>
  );
}
