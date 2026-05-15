import React from "react";

interface AuthHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-14 flex flex-col space-y-2 text-center">
      <h1 className="text-dark-text text-3xl font-bold tracking-tight">
        {title}
      </h1>
      {subtitle && <p className="text-grey-dark text-base">{subtitle}</p>}
    </div>
  );
}
