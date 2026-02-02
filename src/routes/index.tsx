import { createFileRoute } from "@tanstack/react-router";

import { useSensorWebSocket } from "@/lib/hooks/useSensorWebSocket";

import { PowerChart } from "@/components/power-chart";
import { EnergyChart } from "@/components/energy-chart";
import { MetersTable } from "@/components/meters-table";
import { SystemOverview } from "@/components/system-overview";
import { PowerFlowDiagram } from "@/components/power-flow-diagram";
import { EnvironmentalChart } from "@/components/environmental-chart";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  useSensorWebSocket(); // This "starts" the listener

  return (
    <main className="container mx-auto space-y-6 p-4">
      {/* System Overview */}
      <section>
        <SystemOverview />
      </section>

      {/* Power Flow Diagram */}
      <section>
        <PowerFlowDiagram />
      </section>

      {/* Power & Energy Charts */}
      <section className="grid gap-4 lg:grid-cols-2">
        <PowerChart />
        <EnergyChart />
      </section>

      {/* Environmental & Device Status */}
      <section className="grid gap-4 lg:grid-cols-2">
        <EnvironmentalChart />
        <MetersTable />
      </section>
    </main>
  );
}
