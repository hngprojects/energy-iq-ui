import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamAccessStats } from "@/types/team-access";

export function TeamAccessStatsCards({ stats }: { stats: TeamAccessStats }) {
  const items = [
    { label: "Total Users", value: stats.totalUsers, note: "Active members" },
    { label: "Admin", value: stats.admins, note: "Full access" },
    { label: "Technicians", value: stats.technicians, note: "Alerts and metrics only" },
    { label: "Viewer", value: stats.viewers, note: "Read-only access" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label} size="sm" className="gap-2">
          <CardHeader className="px-4 pt-4">
            <CardDescription>{item.label}</CardDescription>
            <CardTitle className="text-3xl">{item.value}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-muted-foreground text-sm">{item.note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

