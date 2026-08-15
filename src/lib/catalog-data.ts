/**
 * Phase 1 placeholder catalog content.
 * Replaced by Lovable Cloud tables in Phase 2 — shape mirrors the planned schema.
 */

export type Brand = {
  slug: string;
  name: string;
  origin: string;
  tagline: string;
  focus: string[];
};

export const brands: Brand[] = [
  {
    slug: "magicmotorsport",
    name: "FLEX / Magicmotorsport",
    origin: "Italy",
    tagline: "Modular OBD, BENCH and BOOT programming platform.",
    focus: ["ECU programming", "Bench", "Boot"],
  },
  {
    slug: "autotuner",
    name: "AutoTuner",
    origin: "Netherlands",
    tagline: "Fast read/write tool with broad master and slave coverage.",
    focus: ["ECU / TCU", "Master", "Slave"],
  },
  {
    slug: "alientech",
    name: "Alientech",
    origin: "Italy",
    tagline: "KESS and K-TAG heritage for professional calibration.",
    focus: ["Calibration", "Bench", "Licenses"],
  },
  {
    slug: "smok",
    name: "SMOK",
    origin: "Poland",
    tagline: "Key programming, immobiliser and control unit solutions.",
    focus: ["Immobiliser", "Key programming"],
  },
  {
    slug: "carprotool",
    name: "CarProTool",
    origin: "Poland",
    tagline: "Programmers, adapters and specialist cable sets.",
    focus: ["Adapters", "Cables"],
  },
  {
    slug: "thinkcar",
    name: "Thinkcar",
    origin: "Germany / EU distribution",
    tagline: "Workshop diagnostic tablets and service reset platforms.",
    focus: ["Diagnostics", "Service reset"],
  },
  {
    slug: "obdstar",
    name: "OBDSTAR",
    origin: "EU distribution",
    tagline: "Key programming and cluster calibration equipment.",
    focus: ["Key programming", "Cluster"],
  },
];

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: "cpu" | "microchip" | "key" | "cable" | "wrench" | "shield" | "download" | "gauge";
  count: number;
};

export const categories: Category[] = [
  {
    slug: "ecu-programming-tools",
    name: "ECU Programming Tools",
    description: "OBD, BENCH and BOOT capable programmers for engine control units.",
    icon: "cpu",
    count: 48,
  },
  {
    slug: "tcu-programming",
    name: "TCU Programming",
    description: "Transmission control unit reading, writing and cloning equipment.",
    icon: "gauge",
    count: 21,
  },
  {
    slug: "diagnostic-equipment",
    name: "Diagnostic Equipment",
    description: "Workshop-grade diagnostic tablets, interfaces and service tooling.",
    icon: "wrench",
    count: 36,
  },
  {
    slug: "control-units",
    name: "Control Units",
    description: "New, used and refurbished ECUs and TCUs with verified part numbers.",
    icon: "microchip",
    count: 240,
  },
  {
    slug: "key-programming",
    name: "Key & Immobiliser",
    description: "Key programmers, immobiliser tooling and transponder accessories.",
    icon: "key",
    count: 29,
  },
  {
    slug: "cables-adapters",
    name: "Cables & Adapters",
    description: "Bench harnesses, boot adapters, OBD leads and connector sets.",
    icon: "cable",
    count: 132,
  },
  {
    slug: "licenses-software",
    name: "Licenses & Software",
    description: "Protocol licenses, software modules and annual update packages.",
    icon: "download",
    count: 74,
  },
  {
    slug: "warranty-support",
    name: "Warranty & Support",
    description: "Extended warranty plans and registered device support packages.",
    icon: "shield",
    count: 8,
  },
];

export const capabilities = [
  {
    title: "Verified compatibility data",
    body: "Every tool lists the control units it supports by hardware and software number — OBD, BENCH, BOOT, master or slave.",
  },
  {
    title: "Serial-bound licenses",
    body: "Licenses are issued against your device serial and visible in your account the moment payment is confirmed.",
  },
  {
    title: "Authorised European supply",
    body: "Stock sourced from authorised manufacturer channels, invoiced with full VAT documentation.",
  },
  {
    title: "Warranty on record",
    body: "Devices register automatically to your account with warranty status and claim history in one place.",
  },
];
