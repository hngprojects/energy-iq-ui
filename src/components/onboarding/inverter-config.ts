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
  fields: [InverterFieldConfig, InverterFieldConfig, InverterFieldConfig];
  connectLabel: string;
  helper: string[];
}

export const INVERTER_CONFIG: Record<InverterType, InverterConfig> = {
  victron: {
    name: "Victron",
    fields: [
      {
        id: "vrm-email",
        label: "Enter VRM Email",
        placeholder: "you@email.com",
        kind: "email",
      },
      {
        id: "vrm-password",
        label: "Enter VRM Password",
        placeholder: "************",
        kind: "password",
      },
      {
        id: "vrm-token",
        label: "Enter VRM API Token",
        placeholder: "************",
        kind: "password",
      },
    ],
    connectLabel: "Connect",
    helper: [
      "Use your VRM login details",
      "Find Your Api token in your Profile → API Access Tokens → Generate token",
    ],
  },
  growatt: {
    name: "Growatt",
    fields: [
      {
        id: "growatt-username",
        label: "Enter ShinePhone Username",
        placeholder: "you@email.com",
        kind: "email",
      },
      {
        id: "growatt-password",
        label: "Enter ShinePhone Password",
        placeholder: "************",
        kind: "password",
      },
      {
        id: "growatt-plant",
        label: "Enter Plant ID (optional)",
        placeholder: "0A-234-567-897",
        kind: "text",
        optional: true,
      },
    ],
    connectLabel: "Connect",
    helper: [
      "Find your Growatt Email and password, Use your Growatt Shine app login",
      "For your Growatt Plant ID, we'll auto-detect your system if left blank",
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
};
