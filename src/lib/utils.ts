import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats raw power values (Watts) to a human-readable string.
 * Automatically switches between W and kW based on magnitude.
 */
export const formatPower = (watts: number | undefined | null): string => {
  if (watts === undefined || watts === null) return "0 W";

  if (Math.abs(watts) >= 1000) {
    return `${(watts / 1000).toFixed(2)} kW`;
  }

  return `${watts.toFixed(0)} W`;
};

/**
 * Specifically for your energy accumulation (Wh to kWh)
 */
export const formatEnergy = (wattHours: number | undefined | null): string => {
  if (wattHours === undefined || wattHours === null) return "0.00 kWh";

  const kwh = wattHours / 1000;
  return `${kwh.toFixed(2)} kWh`;
};
