import { atom } from "jotai";

import type { SHTData } from "@/types";

import { latestSensorDataAtom } from "@/integrations/jotai/store";

// Create some dummy historical data
const generateDummyHistory = () => {
  const now = Date.now();
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(now - (20 - i) * 60000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: 24 + Math.random() * 2,
    humidity: 45 + Math.random() * 5,
  }));
};

export const environmentalHistoryAtom = atom(generateDummyHistory());

// Derived atom to append the latest live SHT reading to the chart
export const environmentalChartDataAtom = atom((get) => {
  const history = get(environmentalHistoryAtom);
  const live = get(latestSensorDataAtom);

  // Find the SHT sensor in the live payload
  const shtDevice = live?.data.find((d) => d.type === "SHT");

  if (!shtDevice) return history;

  const liveData = shtDevice.data as SHTData;
  const newPoint = {
    time: new Date(live!.ts * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: liveData.temperature,
    humidity: liveData.humidity,
  };

  // Keep only the last 20 points for the chart
  return [...history.slice(1), newPoint];
});
export { latestSensorDataAtom };
