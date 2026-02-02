import { atom } from "jotai";

import type { PZEMData } from "@/types";

import { latestSensorDataAtom } from "@/integrations/jotai/store";

// Helper to generate 10 hours of dummy energy data (increasing)
const generateEnergyHistory = () => {
  const now = Date.now();
  let baseEnergy = 120.5; // Starting kWh
  return Array.from({ length: 12 }, (_, i) => {
    baseEnergy += Math.random() * 0.5; // Simulate consumption
    return {
      time: new Date(now - (12 - i) * 3600000).toLocaleTimeString([], {
        hour: "2-digit",
      }),
      energy: parseFloat(baseEnergy.toFixed(2)),
    };
  });
};

export const energyHistoryAtom = atom(generateEnergyHistory());

// Derived atom to combine history with the latest PZEM reading
export const energyChartDataAtom = atom((get) => {
  const history = get(energyHistoryAtom);
  const live = get(latestSensorDataAtom);

  // Find the PZEM meter in the live payload
  const pzemDevice = live?.data.find((d) => d.type === "PZEM");

  if (!pzemDevice) return history;

  const liveData = pzemDevice.data as PZEMData;
  
  const newPoint = {
    time: new Date(live!.ts * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    energy: liveData.energy / 1000, // Converting Wh from Python to kWh for UI
  };

  // Append latest live point to the end of the history array
  return [...history, newPoint];
});
