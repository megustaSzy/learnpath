"use client";

import { useState } from "react";
import { joinRoadmap } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function JoinRoadmapButton({ roadmapId, roadmapSlug }: { roadmapId: string; roadmapSlug: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    setError("");
    try {
      await joinRoadmap(roadmapId);
      router.push(`/dashboard/progress/${roadmapSlug}`);
    } catch (err: any) {
      setError(err.message || "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleJoin} disabled={loading} size="lg">
        {loading ? "Joining..." : "Join Roadmap"}
      </Button>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
