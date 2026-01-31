import { useAtomValue } from "jotai";
import { latestSensorDataAtom } from "@/integrations/jotai/store";
import type { SHTData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Thermometer, Droplets } from "lucide-react";
import { useSHTHistory } from "@/integrations/tanstack-query/hooks/useSensorQuery";
import { useMemo } from "react";

export function EnvironmentalChart() {
  // Subscribe to live and chart data
  const { data: history, isLoading } = useSHTHistory();
  const livePayload = useAtomValue(latestSensorDataAtom);

  // Extract latest SHT values for the header badges
  const shtSensor = livePayload?.data.find((d) => d.type === "SHT");
  const latestSHT = (shtSensor?.data as SHTData) || {
    temperature: 0,
    humidity: 0,
  };

  const chartData = useMemo(() => {
    if (!history) return [];

    const formattedHistory = history.map((record) => ({
      time: new Date(Number(record.timestamp) * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: record.temperature,
      humidity: record.humidity,
    }));

    const liveSHT = livePayload?.data.find((d) => d.type === "SHT")
      ?.data as SHTData;

    if (liveSHT) {
      formattedHistory.push({
        time: "Now",
        temperature: liveSHT.temperature,
        humidity: liveSHT.humidity,
      });
    }

    return formattedHistory;
  }, [history, livePayload]);

  return (
    <Card className="border-border/50 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Environmental Conditions
          </CardTitle>
          <div className="flex gap-4">
            {/* Real-time Temperature Badge */}
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-chart-4/10 p-1.5">
                <Thermometer className="h-3.5 w-3.5 text-chart-4" />
              </div>
              <span className="text-sm font-semibold text-chart-4">
                {latestSHT.temperature.toFixed(1)}°C
              </span>
            </div>
            {/* Real-time Humidity Badge */}
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-chart-3/10 p-1.5">
                <Droplets className="h-3.5 w-3.5 text-chart-3" />
              </div>
              <span className="text-sm font-semibold text-chart-3">
                {latestSHT.humidity.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <div>Loading chart data...</div>
          </>
        ) : (
          <div className="h-64 w-full">
            {/* Increased height for better visibility */}
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#888888"
                  fontSize={11}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  yAxisId="temp"
                  domain={["dataMin - 2", "dataMax + 2"]}
                  stroke="#f97316"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `${value}°C`}
                />
                <YAxis
                  yAxisId="humidity"
                  orientation="right"
                  domain={[0, 100]}
                  stroke="#06b6d4"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false} // Disable animation for smoother live updates
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
