import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <section 
      aria-label="Loading Dashboard"
      aria-busy="true"
      aria-live="polite"
      className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center gap-4"
    >
      <figure className="relative flex h-24 w-24 items-center justify-center m-0">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" aria-hidden="true" />
        
        {/* Spinner */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-background/50 backdrop-blur-sm shadow-xl shadow-primary/10" aria-hidden="true">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </figure>
      
      <header className="flex flex-col items-center gap-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground/90">Loading</h2>
        <p className="text-sm text-muted-foreground animate-pulse">Waking up the server, please wait...</p>
      </header>
    </section>
  );
}
