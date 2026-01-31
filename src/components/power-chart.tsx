import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { latestSensorDataAtom } from "@/integrations/jotai/store";
import {
  usePZEMHistory,
  useDDSUHistory,
} from "@/integrations/tanstack-query/hooks/useSensorQuery";
import type { DDSUData, PZEMData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function PowerChart() {
  // 1. Fetch historical power from DB
  const { data: ddsuHistory, isLoading: isDDSULoading } = useDDSUHistory();
  const { data: pzemHistory, isLoading: isPZEMLoading } = usePZEMHistory();

  // 2. Subscribe to WebSocket for real-time gap filling
  const livePayload = useAtomValue(latestSensorDataAtom);

  // 3. Merge data sources
  const chartData = useMemo(() => {
    // Map history to timestamps for alignment
    const timeline: Record<
      number,
      { time: string; acPower: number; dcPower: number }
    > = {};

    // Process AC history (DDSU)
    ddsuHistory?.forEach((record) => {
      timeline[record.timestamp] = {
        time: new Date(Number(record.timestamp) * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        acPower: record.power,
        dcPower: 0,
      };
    });

    // Process DC history (PZEM)
    pzemHistory?.forEach((record) => {
      if (timeline[record.timestamp]) {
        timeline[record.timestamp].dcPower = record.power;
      } else {
        timeline[record.timestamp] = {
          time: new Date(Number(record.timestamp) * 1000).toLocaleTimeString(
            [],
            { hour: "2-digit", minute: "2-digit" },
          ),
          acPower: 0,
          dcPower: record.power,
        };
      }
    });

    // Convert map to sorted array
    const baseData = Object.values(timeline).sort((a, b) =>
      a.time.localeCompare(b.time),
    );

    // Append live data point
    const ddsuLive = livePayload?.data.find(
      (d) => d.id === 1 && d.type === "DDSU",
    )?.data as DDSUData;
    const pzemLive = livePayload?.data.find(
      (d) => d.id === 7 && d.type === "PZEM",
    )?.data as PZEMData;

    if (ddsuLive || pzemLive) {
      baseData.push({
        time: "Now",
        acPower: ddsuLive?.power || 0,
        dcPower: pzemLive?.power || 0,
      });
    }

    return baseData;
  }, [ddsuHistory, pzemHistory, livePayload]);

  if ((isDDSULoading || isPZEMLoading) && chartData.length === 0) {
    return (
      <Card className="border-border/50 h-72 flex items-center justify-center text-sm">
        Loading power records...
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Power Generation Over Time
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
                <linearGradient
                  id="acPowerGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="dcPowerGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#eab308" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
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
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}kW`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                }}
                formatter={(value: number) => [`${value.toFixed(0)} W`, ""]}
              />
              <Legend verticalAlign="top" align="right" height={36} />
              <Area
                type="monotone"
                dataKey="dcPower"
                name="PV Generation (DC)"
                stroke="#eab308"
                fill="url(#dcPowerGradient)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="acPower"
                name="Inverter Output (AC)"
                stroke="#10b981"
                fill="url(#acPowerGradient)"
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
