import type { InverterType } from "./inverter-type-step";

export type FieldKind = "email" | "password" | "text";

export interface InverterFieldConfig {
  id: string;
  label: string;
  placeholder: string;
  kind: FieldKind;
  optional?: boolean;
}

export interface InverterConfig {
  name: string;
  fields: InverterFieldConfig[];
  connectLabel: string;
  helper: string[];
}

export const INVERTER_CONFIG: Record<InverterType, InverterConfig> = {
  victron: {
    name: "Victron",
    fields: [
      {
        id: "vrm-token",
        label: "Enter VRM API Token",
        placeholder: "************",
        kind: "password",
      },
    ],
    connectLabel: "Connect",
    helper: [
      "Find Your Api token in your Profile → API Access Tokens → Generate token",
    ],
  },
  growatt: {
    name: "Growatt",
    fields: [
      {
        id: "growatt-token",
        label: "Enter Growatt API Token",
        placeholder: "************",
        kind: "password",
      },
    ],
    connectLabel: "Connect",
    helper: [
      "Find your Growatt API token in your ShinePhone settings or developer portal",
    ],
  },
  sunsynk: {
    name: "Sunsynk",
    fields: [
      {
        id: "sunsynk-email",
        label: "Enter Solarman Email",
        placeholder: "you@email.com",
        kind: "email",
      },
      {
        id: "sunsynk-password",
        label: "Enter SolarMan Password",
        placeholder: "************",
        kind: "password",
      },
      {
        id: "sunsynk-plant",
        label: "Enter Plant ID(optional)",
        placeholder: "0A-234-567-897",
        kind: "text",
        optional: true,
      },
    ],
    connectLabel: "Save Inverter",
    helper: [
      "Use your Sunsynk / Solarman app login detail",
      "For your Sunsynk Plant ID, we'll auto-detect your system if left blank",
    ],
  },
  deye: {
    name: "Deye",
    fields: [
      {
        id: "deye-email",
        label: "Enter Solarman Email",
        placeholder: "you@email.com",
        kind: "email",
      },
      {
        id: "deye-password",
        label: "Enter SolarMan Password",
        placeholder: "************",
        kind: "password",
      },
      {
        id: "deye-plant",
        label: "Enter Plant ID(optional)",
        placeholder: "0A-234-567-897",
        kind: "text",
        optional: true,
      },
    ],
    connectLabel: "Save Inverter",
    helper: [
      "Use your Deye / Solarman app login detail",
      "For your Deye Plant ID, we'll auto-detect your system if left blank",
    ],
  },
};
