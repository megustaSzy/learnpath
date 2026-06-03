import { getActivityLogs } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default async function ActivityPage() {
  const logs = await getActivityLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity History</h1>
        <p className="text-muted-foreground">A record of your learning journey</p>
      </div>

      {logs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <History className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground">Start learning to see your activity here.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative flex gap-4 pl-8">
                    <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                    <div>
                      <p className="font-medium text-sm">{log.activity}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
