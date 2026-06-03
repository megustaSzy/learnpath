import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
        
        {/* Spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl shadow-primary/10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        <h3 className="text-xl font-semibold tracking-tight text-foreground/90">Loading</h3>
        <p className="text-sm text-muted-foreground animate-pulse">Waking up the server, please wait...</p>
      </div>
    </div>
  );
}
