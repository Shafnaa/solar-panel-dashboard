import { atom } from "jotai";

import type { PZEMData } from "@/types";

import { latestSensorDataAtom } from "@/integrations/jotai/store";

// 1. Yield Today: We'll simulate this based on the live Energy reading
export const yieldTodayAtom = atom((get) => {
  const live = get(latestSensorDataAtom);
  const pzem = live?.data.find((d) => d.id === 7 && d.type === "PZEM");
  const currentEnergyWh = (pzem?.data as PZEMData)?.energy || 0;

  // Assuming 'energy' from PZEM is cumulative Wh
  // We'll return it in kWh for the UI
  return currentEnergyWh / 1000;
});

// 2. Lifetime Yield: Dummy base + real-time increment
const BASE_LIFETIME_MWH = 85.2;
export const lifetimeYieldAtom = atom((get) => {
  const todayKwh = get(yieldTodayAtom);
  return BASE_LIFETIME_MWH + todayKwh / 1000; // MWh
});

// 3. CO2 Reduction: Standard multiplier (approx 0.4kg per kWh)
export const co2ReductionAtom = atom((get) => {
  const totalKwh = get(yieldTodayAtom);
  const CO2_FACTOR = 0.411; // kg/kWh
  return totalKwh * CO2_FACTOR;
});
