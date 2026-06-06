"use client";

import { useMemo, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectField } from "@/components/settings/select-field";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import type { ConnectInverterRequest } from "@/types/inverter";

const statusStyles = {
  active: {
    label: "Active",
    className: "bg-chart-battery text-success-alt",
    dotClassName: "bg-success-alt",
  },
  warning: {
    label: "Offline",
    className: "bg-warning-bg text-warning",
    dotClassName: "bg-warning",
  },
  unknown: {
    label: "Unknown",
    className: "bg-muted text-muted-foreground",
    dotClassName: "bg-muted-foreground",
  },
};

function getStatusMeta(status?: string) {
  const normalized = status?.toLowerCase();

  if (!normalized || normalized === "active" || normalized === "online") {
    return statusStyles.active;
  }

  if (
    normalized === "offline" ||
    normalized === "stale" ||
    normalized === "inactive"
  ) {
    return {
      ...statusStyles.warning,
      label: normalized.charAt(0).toUpperCase() + normalized.slice(1),
    };
  }

  return statusStyles.unknown;
}

function formatRelativeTime(value?: string) {
  if (!value) return "Never synced";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Unavailable";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) return "Just now";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SystemDeviceClient() {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("Sunsynk");
  const [capacity, setCapacity] = useState("");
  const [serial, setSerial] = useState("");
  const [token, setToken] = useState("");

  const { useUserInverters, useConnectInverter, useSupportedBrands } =
    useInverterQueries();

  const { data: inverters } = useUserInverters();
  const { data: brands } = useSupportedBrands();

  const connect = useConnectInverter(() => setOpen(false));

  const brandOptions = brands?.data ?? ["Growatt", "Sunsynk", "Victron"];

  const devices = useMemo(() => {
    if (!inverters?.length) return [];

    return inverters.map((item) => ({
      initials: item.brand.slice(0, 2).toUpperCase(),
      name: `${item.brand} ${item.capacityKw ?? ""}kW Inverter`.trim(),
      meta: item.capacityKw
        ? `Hybrid Inverter • ${item.capacityKw}kw`
        : "Hybrid Inverter",
      serial: item.serialNumber ?? "Serial unavailable",
      connectionDate: new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      lastSync: formatRelativeTime(
        item.lastSyncAt ?? item.updatedAt ?? item.createdAt,
      ),
      status: getStatusMeta(item.status),
    }));
  }, [inverters]);

  const handleSubmit = () => {
    const payload: ConnectInverterRequest = {
      brand: brand.toUpperCase(),
    };

    const normalizedBrand = brand.toLowerCase();

    if (normalizedBrand === "growatt") {
      payload.growattApiToken = token;
    }

    if (normalizedBrand === "victron") {
      payload.victronAccessToken = token;
    }

    if (normalizedBrand === "sandbox") {
      payload.sandboxAccessToken = token;
    }

    if (normalizedBrand === "sunsynk") {
      return; // show toast/error until sunsynk credential fields are implemented
    }

    if (!token.trim()) {
      return; // show toast/error: token required
    }

    connect.mutate(payload);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-dark-text lg:text-2xl">
            System & Device Management
          </h1>
          <p className="mt-1 max-w-170 text-sm text-[#5D5C5D] lg:text-base">
            Overview of your connected systems, inverter configurations, and
            diagnostic alerts.
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(true)}
          className="h-11 w-full rounded-lg bg-secondary text-white lg:w-auto"
        >
          <Plus className="h-4 w-4" />
          Connect New Inverter
        </Button>
      </div>

      <div className="space-y-6">
        {devices.map((device) => (
          <article
            key={device.serial}
            className="rounded-[6px] border border-border bg-white p-6"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[#020617] font-semibold text-white">
                  {device.initials}
                </div>
                <div>
                  <h2 className="font-bold text-dark-text">{device.name}</h2>
                  <p className="text-sm text-[#5D5C5D]">{device.meta}</p>
                </div>
              </div>

              <span
                className={`inline-flex w-fit items-center gap-1.5 place-self-start rounded-full px-3 py-1.5 text-xs font-medium lg:place-self-start lg:justify-self-end ${device.status.className}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${device.status.dotClassName}`}
                />
                {device.status.label}
              </span>
            </div>

            <dl className="mt-6 grid gap-4 text-sm lg:grid-cols-[1fr_auto]">
              <dt className="text-[#5D5C5D]">Serial Number</dt>
              <dd className="font-medium text-right">{device.serial}</dd>
              <dt className="text-[#5D5C5D]">Connection Date</dt>
              <dd className="font-medium text-right">
                {device.connectionDate}
              </dd>
              <dt className="text-[#5D5C5D]">Last Sync</dt>
              <dd className="font-medium text-right">{device.lastSync}</dd>
            </dl>

            <div className="mt-7 grid grid-cols-2 gap-4 lg:flex lg:justify-end">
              <Button
                variant="outline"
                className="h-11 rounded-lg border-border"
              >
                Reconnect
              </Button>
              <Button
                variant="outline"
                className="h-11 rounded-lg border-border"
              >
                View Details
              </Button>
            </div>
          </article>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-dark-text/35 px-6 backdrop-blur-[2px]">
          <div className="w-full max-w-114 rounded-[6px] bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-dark-text">
                  Connect New Inverter
                </h2>
                <p className="text-sm text-[#5D5C5D]">
                  Link a new device to your EnergyIQ workspace.
                </p>
              </div>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Inverter brand</Label>
                <SelectField
                  value={brand}
                  onChange={setBrand}
                  options={brandOptions}
                  className="h-11 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>System Capacity</Label>
                <Input
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g 8"
                  className="h-11 text-sm placeholder:text-sm"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label>Hardware serial number</Label>
              <Input
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="e.g SN-SSK8KW-2026"
                className="h-11 text-sm placeholder:text-sm"
              />
            </div>

            <div className="mt-4 space-y-2">
              <Label>Access API token</Label>
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="paste your secure access token"
                autoComplete="off"
                className="h-11 text-sm placeholder:text-sm"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                className="h-11 rounded-lg border-border"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="h-11 w-full rounded-lg bg-secondary text-white lg:w-auto"
                onClick={handleSubmit}
                disabled={connect.isPending}
              >
                {connect.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                {connect.isPending
                  ? "Verifying Inverter"
                  : "Verify & Link System"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

