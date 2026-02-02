import { useMemo } from "react";

import { usePZEMHistory } from "@/integrations/tanstack-query/hooks/useSensorQuery";

export function useHistoricalYield() {
  const { data: history, isLoading } = usePZEMHistory();

  return useMemo(() => {
    if (!history) return { totalKwh: 0, co2Kg: 0, isLoading };

    // Sum energy from all hourly records
    // Convert Wh (DB) to kWh (UI)
    const totalKwh = history.reduce((acc, rec) => acc + rec.energy, 0) / 1000;

    // Standard CO2 conversion (approx 0.411 kg per kWh)
    const co2Kg = totalKwh * 0.411;

    return { totalKwh, co2Kg, isLoading };
  }, [history, isLoading]);
}
