import { Sun } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Sun className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Solar PV Monitor
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time Power Monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4"></div>
      </div>
    </header>
  );
}
