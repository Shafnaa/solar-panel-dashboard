import { atom } from "jotai";

import { latestSensorDataAtom } from "../store";

// 1. Atom to hold your database devices
export const devicesMetadataAtom = atom<any[]>([]);

// 2. Derived atom to combine data
export const metersWithNamesAtom = atom((get) => {
  const sensorData = get(latestSensorDataAtom);
  const metadata = get(devicesMetadataAtom);

  if (!sensorData) return null;

  return {
    ...sensorData,
    data: sensorData.data.map((meter) => {
      // Find the name from the database table matching the ID
      const meta = metadata.find((m) => m.id === meter.id);
      return {
        ...meter,
        name: meta ? meta.name : meter.id, // Fallback to ID if name not found
      };
    }),
  };
});
