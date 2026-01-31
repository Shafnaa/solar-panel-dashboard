import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun } from "lucide-react";
import type { DCMeterData } from "@/lib/mock-data";

interface DCMetersTableProps {
  meters: DCMeterData[];
}

export function DCMetersTable({ meters }: DCMetersTableProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <Card className="border-border/50 bg-card lg:col-span-3">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="rounded-md bg-accent/10 p-2">
          <Sun className="h-4 w-4 text-accent" />
        </div>
        <CardTitle className="text-sm font-medium">
          DC Power Meters (PZEM-017)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 text-muted-foreground">
                <th className="pb-3 text-left font-medium">Device ID</th>
                <th className="pb-3 text-right font-medium">Voltage</th>
                <th className="pb-3 text-right font-medium">Current</th>
                <th className="pb-3 text-right font-medium">Power</th>
                <th className="pb-3 text-right font-medium">Energy</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {meters.map((meter) => (
                <tr
                  key={meter.id}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="py-3 font-mono text-xs text-muted-foreground">
                    {meter.id}
                  </td>
                  <td className="py-3 text-right font-mono">
                    {meter.voltage.toFixed(1)} V
                  </td>
                  <td className="py-3 text-right font-mono">
                    {meter.current.toFixed(2)} A
                  </td>
                  <td className="py-3 text-right font-mono text-accent">
                    {meter.power} W
                  </td>
                  <td className="py-3 text-right font-mono text-primary">
                    {meter.energy.toFixed(2)} kWh
                  </td>
                  <td className="py-3 text-right">
                    <Badge
                      variant={meter.isOnline ? "default" : "destructive"}
                      className={
                        meter.isOnline
                          ? "bg-accent/20 text-accent hover:bg-accent/30"
                          : ""
                      }
                    >
                      {meter.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Last updated: {formatTime(meters[0]?.timestamp || new Date())}
        </p>
      </CardContent>
    </Card>
  );
}
