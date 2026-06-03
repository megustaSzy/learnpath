import { getWeeklyGoals } from "@/lib/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, CheckCircle, Clock } from "lucide-react";
import { GoalActions } from "./goal-actions";

export default async function GoalsPage() {
  const goals = await getWeeklyGoals();
  const pending = goals.filter((g) => g.status === "PENDING");
  const completed = goals.filter((g) => g.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Weekly Goals</h1>
          <p className="text-muted-foreground">Set and track your learning targets</p>
        </div>
        <GoalActions mode="create" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <Target className="h-8 w-8 text-blue-400" />
            <div><p className="text-2xl font-bold">{goals.length}</p><p className="text-xs text-muted-foreground">Total Goals</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <Clock className="h-8 w-8 text-amber-400" />
            <div><p className="text-2xl font-bold">{pending.length}</p><p className="text-xs text-muted-foreground">Pending</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div><p className="text-2xl font-bold">{completed.length}</p><p className="text-xs text-muted-foreground">Completed</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Goals */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Active Goals</h2>
          {pending.map((goal) => {
            const isOverdue = new Date(goal.deadline) < new Date();
            return (
              <Card key={goal.id} className={isOverdue ? "border-red-500/30" : ""}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${isOverdue ? "bg-red-500" : "bg-amber-500"}`} />
                    <div>
                      <p className="font-medium">{goal.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                        {isOverdue && <Badge variant="destructive" className="ml-2 text-xs">Overdue</Badge>}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <GoalActions mode="complete" goalId={goal.id} />
                    <GoalActions mode="delete" goalId={goal.id} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed Goals */}
      {completed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Completed Goals</h2>
          {completed.map((goal) => (
            <Card key={goal.id} className="opacity-70">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="font-medium line-through">{goal.title}</p>
                    <p className="text-xs text-muted-foreground">Deadline: {new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                <GoalActions mode="delete" goalId={goal.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {goals.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-16 w-16 text-muted-foreground/30" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No goals yet</p>
            <p className="text-sm text-muted-foreground">Create your first weekly goal to stay on track.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
