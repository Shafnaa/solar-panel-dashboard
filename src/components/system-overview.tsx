import { ZapIcon, LeafyGreenIcon } from "lucide-react";

import { useHistoricalYield } from "@/hooks/useHistoricalYield";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SystemOverview() {
  // Yield data is strictly historical from the DB
  const { totalKwh, co2Kg, isLoading } = useHistoricalYield();

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
