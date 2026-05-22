import Link from "next/link";
import { Eye, UserRound, Wrench, Bell } from "lucide-react";

const SETTING_CARDS = [
  {
    icon: UserRound,
    title: "Account & Profile",
    description:
      "Manage your enterprise identity, update localisation preference, and configure multi-factor authentication protocols.",
    href: "/dashboard/settings/profile",
  },
  {
    icon: Wrench,
    title: "System & Device",
    description:
      "Manage your enterprise identity, update localisation preference, and configure multi-factor authentication protocols.",
    href: null,
  },
  {
    icon: UserRound,
    title: "Team & Access",
    description:
      "Control organisational hierarchies by assigning specific user roles, permissions, and administrative access levels.",
    href: null,
  },
  {
    icon: Bell,
    title: "Notifications",
    description:
      "Control organisational hierarchies by assigning specific user roles, permissions, and administrative access levels.",
    href: null,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-text">Settings Overview</h1>
        <p className="mt-1 text-sm text-[#5D5C5D]">
          Manage your EnergyIQ environment, team permissions and system health
        </p>
      </div>

      {/* Security Audit Banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-white px-6 py-4">
        <div>
          <h2 className="font-semibold text-dark-text">Security Audit</h2>
          <p className="mt-0.5 text-sm text-[#5D5C5D]">
            Last audit completed 2 hours ago. No anomalies detected.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-white hover:bg-secondary/90 transition-colors"
        >
          <Eye className="h-4 w-4" aria-hidden="true" />
          Review Logs
        </button>
      </div>

      {/* Settings Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SETTING_CARDS.map((card) => {
          const Icon = card.icon;
          const inner = (
            <div className="flex h-full flex-col rounded-xl border border-border bg-white p-6 transition-colors hover:border-border/80">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F4F6]">
                <Icon className="h-5 w-5 text-[#6B7280]" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-dark-text">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-[#5D5C5D]">{card.description}</p>
            </div>
          );

          return card.href ? (
            <Link key={card.title} href={card.href} className="block">
              {inner}
            </Link>
          ) : (
            <div key={card.title}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}

