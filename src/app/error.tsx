"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="max-w-md text-sm text-slate-600">
        The page failed to load. This often happens when the dev cache is stale.
        Stop the server, delete the <code className="rounded bg-slate-200 px-1">.next</code> folder,
        then run <code className="rounded bg-slate-200 px-1">npm run dev:clean</code>.
      </p>
      <Button variant="brand" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
