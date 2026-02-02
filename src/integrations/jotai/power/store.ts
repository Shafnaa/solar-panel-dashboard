import { atom } from "jotai";

import type { DDSUData, PZEMData } from "@/types";

import { latestSensorDataAtom } from "@/integrations/jotai/store";

// Helper to generate dummy power history (20 points)
const generatePowerHistory = () => {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now - (20 - i) * 60000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    acPower: 1500 + Math.random() * 500, // Watts
    dcPower: 1800 + Math.random() * 600, // Watts
  }));
};

const powerHistoryAtom = atom(generatePowerHistory());

export const powerChartDataAtom = atom((get) => {
  const history = get(powerHistoryAtom);
  const live = get(latestSensorDataAtom);

  if (!live) return history;

  // Extract AC Power from DDSU (ID 1)
  const ddsu = live.data.find((d) => d.id === 1 && d.type === "DDSU");
  const acPower = (ddsu?.data as DDSUData)?.power || 0;

  // Extract DC Power from PZEM (ID 7)
  const pzem = live.data.find((d) => d.id === 7 && d.type === "PZEM");
  const dcPower = (pzem?.data as PZEMData)?.power || 0;

  const newPoint = {
    time: new Date(live.ts * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    acPower,
    dcPower,
  };

  // Maintain a rolling window of the last 20 samples
  return [...history.slice(1), newPoint];
});
