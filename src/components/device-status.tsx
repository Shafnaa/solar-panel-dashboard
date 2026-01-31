import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ACMeterData, DCMeterData } from "@/lib/mock-data";

interface DeviceStatusProps {
  acMeters: ACMeterData[];
  dcMeters: DCMeterData[];
}

export function DeviceStatus({ acMeters, dcMeters }: DeviceStatusProps) {
  const allDevices = [
    ...acMeters.map((m) => ({ ...m, type: "AC" as const })),
    ...dcMeters.map((m) => ({ ...m, type: "DC" as const })),
  ];

  const onlineCount = allDevices.filter((d) => d.isOnline).length;
  const offlineCount = allDevices.filter((d) => !d.isOnline).length;

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="flex flex-row items-center gap-2">
        <div className="rounded-md bg-chart-3/10 p-2">
          <Activity className="h-4 w-4 text-chart-3" />
        </div>
        <CardTitle className="text-sm font-medium">Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span className="text-sm">{onlineCount} Online</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <span className="text-sm">{offlineCount} Offline</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
          {allDevices.map((device) => (
            <div
              key={device.id}
              className={`flex flex-col items-center rounded-md border p-2 ${
                device.isOnline
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${device.isOnline ? "bg-primary animate-pulse" : "bg-destructive"}`}
              />
              <span className="mt-1 text-[10px] font-mono text-muted-foreground">
                {device.id.split("_")[1]}
              </span>
              <span className="text-[9px] text-muted-foreground">
                {device.type}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
