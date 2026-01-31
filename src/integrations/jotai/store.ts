// store.ts
import { atom } from "jotai";
import type { WSMessage } from "@/types";

// Initialize with null or a default structure
export const latestSensorDataAtom = atom<WSMessage | null>(null);

export const powerFlowEdgesAtom = atom((get) => {
  const sensorData = get(latestSensorDataAtom);
  if (!sensorData) return [];

  // 1. Create a helper map for quick ID lookup
  const powerMap: Record<number, number> = {};
  sensorData.data.forEach((device) => {
    // Only DDSU and PZEM have 'power' fields
    if ("power" in device.data) {
      powerMap[device.id] = (device.data as any).power || 0;
    }
  });

  // 2. Aggregate power for IDs 2 through 6 as requested
  const p2_6 = [2, 3, 4, 5, 6].reduce(
    (sum, id) => sum + (powerMap[id] || 0),
    0,
  );
  const p1 = powerMap[1] || 0;
  const p7 = powerMap[7] || 0;

  // 3. Define the visibility and value rules
  const rules = [
    { id: "e1-4", show: p1 > p7, val: p1 - p7 },
    { id: "e2-4", show: p7 > 0, val: p7 },
    { id: "e3-4", show: p2_6 > p1, val: p2_6 - p1 },
    { id: "e4-3", show: p2_6 < p1, val: p1 - p2_6 },
    // Direct server mappings
    { id: "e4-5", show: (powerMap[2] || 0) > 0, val: powerMap[2] || 0 },
    { id: "e4-6", show: (powerMap[3] || 0) > 0, val: powerMap[3] || 0 },
    { id: "e4-7", show: (powerMap[4] || 0) > 0, val: powerMap[4] || 0 },
    { id: "e4-8", show: (powerMap[5] || 0) > 0, val: powerMap[5] || 0 },
    { id: "e4-9", show: (powerMap[6] || 0) > 0, val: powerMap[6] || 0 },
  ];

  return rules;
});
