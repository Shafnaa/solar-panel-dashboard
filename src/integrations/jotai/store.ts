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

  // 2. Aggregate power for IDs 4 through 8 as requested
  const p4_8 = [4, 5, 6, 7, 8].reduce(
    (sum, id) => sum + (powerMap[id] || 0),
    0,
  );
  const p2 = powerMap[2] || 0;
  const p3 = powerMap[3] || 0;

  // 3. Define the visibility and value rules
  const rules = [
    { id: "e1-4", show: p2 > p3, val: p2 - p3 },
    { id: "e2-4", show: p3 > 0, val: p3 },
    { id: "e3-4", show: p4_8 > p2, val: p4_8 - p2 },
    { id: "e4-3", show: p4_8 < p2, val: p2 - p4_8 },
    // Direct server mappings
    { id: "e4-5", show: (powerMap[4] || 0) > 0, val: powerMap[4] || 0 },
    { id: "e4-6", show: (powerMap[5] || 0) > 0, val: powerMap[5] || 0 },
    { id: "e4-7", show: (powerMap[6] || 0) > 0, val: powerMap[6] || 0 },
    { id: "e4-8", show: (powerMap[7] || 0) > 0, val: powerMap[7] || 0 },
    { id: "e4-9", show: (powerMap[8] || 0) > 0, val: powerMap[8] || 0 },
  ];

  return rules;
});
