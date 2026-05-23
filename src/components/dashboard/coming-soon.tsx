import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";

export function ComingSoonDashboard({
  feature,
  description,
}: {
  feature: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="border-border bg-card flex flex-col items-center gap-5 rounded-2xl border p-10 text-center max-w-md w-full">
        <span className="bg-muted flex h-14 w-14 items-center justify-center rounded-full">
          <Clock className="text-muted-foreground h-6 w-6" />
        </span>
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            {feature}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
          Coming soon
        </span>
        <Link
          href="/dashboard"
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="size-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

