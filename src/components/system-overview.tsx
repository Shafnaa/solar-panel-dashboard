import { useAtomValue } from "jotai";
import { ZapIcon, LeafyGreenIcon, BatteryFullIcon } from "lucide-react";
import { latestSensorDataAtom } from "@/integrations/jotai/store";
import { useHistoricalYield } from "@/hooks/useHistoricalYield";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BMSData, SensorEntry } from "@/types";

export function SystemOverview() {
  // Battery remains real-time from the WebSocket atom
  const sensorData = useAtomValue(latestSensorDataAtom);

  // Yield data is strictly historical from the DB
  const { totalKwh, co2Kg, isLoading } = useHistoricalYield();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Battery Capacity */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded-md bg-blue-500/10 p-2">
            <BatteryFullIcon className="h-4 w-4 text-blue-500" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground ml-2">
            Battery Capacity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-end gap-2">
          <div className="text-2xl font-bold">
            {(
              sensorData?.data.find((d: SensorEntry) => d.type === "BMS")
                ?.data as BMSData
            )?.state_of_charge ?? "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">%</div>
        </CardContent>
      </Card>

      {/* Lifetime Yield - Historical Only */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded-md bg-accent-foreground/10 p-2">
            <ZapIcon className="h-4 w-4 text-accent-foreground" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground ml-2">
            Lifetime Yield
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-end gap-2">
          <div className="text-2xl font-bold">
            {isLoading ? "..." : totalKwh.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">kWh</div>
        </CardContent>
      </Card>

      {/* CO2 Reduction - Historical Only */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center justify-start space-y-0 pb-2">
          <div className="rounded-md bg-green-500/10 p-2">
            <LeafyGreenIcon className="h-4 w-4 text-green-500" />
          </div>
          <CardTitle className="text-sm font-medium text-muted-foreground ml-2">
            CO<sub>2</sub> Emission Reduction
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-end gap-2">
          <div className="text-2xl font-bold">
            {isLoading ? "..." : co2Kg.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">kg</div>
        </CardContent>
      </Card>
    </div>
  );
}
