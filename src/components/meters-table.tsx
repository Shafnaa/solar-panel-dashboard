import { useAtomValue } from "jotai";
import { ZapIcon } from "lucide-react";

import type { DDSUData, PZEMData, SensorEntry } from "@/types";

import { latestSensorDataAtom } from "@/integrations/jotai/store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetersTable() {
  const sensorData = useAtomValue(latestSensorDataAtom);

  // If no data yet, show a loading state
  if (!sensorData) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <ZapIcon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium">Realtime Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-muted-foreground">
            Loading sensor data...
          </div>
        </CardContent>
      </Card>
    );
  }

  // If data is empty, show a connecting state
  if (sensorData.data.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <CardHeader className="flex flex-row items-center gap-2">
          <div className="rounded-md bg-primary/10 p-2">
            <ZapIcon className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-medium">Realtime Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-muted-foreground">Connecting to RTU...</div>
        </CardContent>
      </Card>
    );
  }

  // Filter devices by type based on the backend payload structure
  const pzemMeters = sensorData.data.filter(
    (d: { type: string }) => d.type === "PZEM",
  );
  const ddsuMeters = sensorData.data.filter(
    (d: { type: string }) => d.type === "DDSU",
  );

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="rounded-md bg-primary/10 p-2">
          <ZapIcon className="h-4 w-4 text-primary" />
        </div>
        <CardTitle className="text-sm font-medium">Realtime Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* PZEM Table */}
          <div className="overflow-x-auto">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              PZEM Meters
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="pb-3 text-left font-medium">Device ID</th>
                  <th className="pb-3 text-right font-medium">Voltage</th>
                  <th className="pb-3 text-right font-medium">Current</th>
                  <th className="pb-3 text-right font-medium">Power</th>
                  <th className="pb-3 text-right font-medium">Energy</th>
                </tr>
              </thead>
              <tbody>
                {pzemMeters.map((meter: SensorEntry) => {
                  const data = meter.data as PZEMData; // Type narrowing
                  return (
                    <tr
                      key={meter.id}
                      className="border-b border-border/30 last:border-0"
                    >
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {meter.id}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {data?.voltage.toFixed(1)} V
                      </td>
                      <td className="py-3 text-right font-mono">
                        {data?.current.toFixed(2)} A
                      </td>
                      <td className="py-3 text-right font-mono text-accent">
                        {data?.power.toFixed(1)} W
                      </td>
                      <td className="py-3 text-right font-mono text-primary">
                        {data?.energy.toFixed(2)} Wh
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* DDSU Table */}
          <div className="overflow-x-auto">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              DDSU Meters
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 text-muted-foreground">
                  <th className="pb-3 text-left font-medium">Device ID</th>
                  <th className="pb-3 text-right font-medium">Voltage</th>
                  <th className="pb-3 text-right font-medium">Current</th>
                  <th className="pb-3 text-right font-medium">Power</th>
                  <th className="pb-3 text-right font-medium">Freq</th>
                  <th className="pb-3 text-right font-medium">PF</th>
                </tr>
              </thead>
              <tbody>
                {ddsuMeters.map((meter: SensorEntry) => {
                  const data = meter.data as DDSUData; // Type narrowing
                  return (
                    <tr
                      key={meter.id}
                      className="border-b border-border/30 last:border-0"
                    >
                      <td className="py-3 font-mono text-xs text-muted-foreground">
                        {meter.id}
                      </td>
                      <td className="py-3 text-right font-mono">
                        {data?.voltage.toFixed(1)} V
                      </td>
                      <td className="py-3 text-right font-mono">
                        {data?.current.toFixed(2)} A
                      </td>
                      <td className="py-3 text-right font-mono text-primary">
                        {data?.power.toFixed(1)} W
                      </td>
                      <td className="py-3 text-right font-mono">
                        {data?.frequency.toFixed(2)} Hz
                      </td>
                      <td className="py-3 text-right font-mono">
                        {data?.power_factor.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
