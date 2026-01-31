import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { latestSensorDataAtom } from "@/integrations/jotai/store";
import { usePZEMHistory } from "@/integrations/tanstack-query/hooks/useSensorQuery";
import type { PZEMData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export function EnergyChart() {
  // 1. Fetch historical data via TanStack Query
  const { data: dbHistory, isLoading } = usePZEMHistory();

  // 2. Subscribe to WebSocket atom for the "current minute" point
  const livePayload = useAtomValue(latestSensorDataAtom);

  // 3. Merge DB data and WebSocket data
  const chartData = useMemo(() => {
    // Start with historical database records
    const baseData =
      dbHistory?.map((record) => ({
        time: new Date(Number(record.timestamp) * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        // Convert Wh (DB) to kWh (UI)
        energy: record.energy / 1000,
      })) || [];

    // Find the PZEM meter in the live payload
    const pzemLive = livePayload?.data.find(
      (d) => d.id === 7 && d.type === "PZEM",
    );

    if (pzemLive) {
      const liveData = pzemLive.data as PZEMData;
      baseData.push({
        time: "Now",
        energy: liveData.energy / 1000, //
      });
    }

    return baseData;
  }, [dbHistory, livePayload]);

  if (isLoading && chartData.length === 0) {
    return (
      <Card className="border-border/50 bg-card">
        <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
          Loading energy records...
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Energy Accumulation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={11}
                tickLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={11}
                tickLine={false}
                tickFormatter={(value) => `${value.toFixed(1)} kWh`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [
                  `${value.toFixed(2)} kWh`,
                  "Energy",
                ]}
              />
              <Area
                type="monotone"
                dataKey="energy"
                name="Energy"
                stroke="#06b6d4"
                fill="url(#energyGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
