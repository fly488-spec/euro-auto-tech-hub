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

import type { Category } from "./catalog-data";

export const categoryIcons: Record<Category["icon"], LucideIcon> = {
  cpu: Cpu,
  microchip: MemoryStick,
  key: KeyRound,
  cable: Cable,
  wrench: Wrench,
  shield: Shield,
  download: Download,
  gauge: Gauge,
};
