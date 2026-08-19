import {
  Cable,
  Cpu,
  Download,
  Gauge,
  KeyRound,
  MemoryStick,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const categoryIcons = {
  cpu: Cpu,
  microchip: MemoryStick,
  key: KeyRound,
  cable: Cable,
  wrench: Wrench,
  shield: Shield,
  download: Download,
  gauge: Gauge,
} satisfies Record<string, LucideIcon>;

export type CategoryIconKey = keyof typeof categoryIcons;
