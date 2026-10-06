import Link from "next/link";
import { backendApi } from "@/lib/api";
import { env } from "@/lib/env";

export const metadata = {
  title: "API Health Check | Zvisory",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function HealthCheckPage() {
  const result = await backendApi.pingWithTiming();
  const reachable = Boolean(result.response);
  const statusText = result.response?.status || "UNREACHABLE";
  const latencyMs = result.latencyMs;
  const errorMsg = result.error;
  const details = result.response || { error: result.error };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 sm:p-12 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Express API Reachability</h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Diagnostic test communicating with the backend API
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              reachable
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                reachable ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {reachable ? "REACHABLE" : "UNREACHABLE"}
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <span className="text-zinc-500 dark:text-zinc-400">Target Endpoint</span>
            <span className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
              {env.EXPRESS_API_URL}/ping
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <span className="text-zinc-500 dark:text-zinc-400">Status Response</span>
            <span className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
              {statusText}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60">
            <span className="text-zinc-500 dark:text-zinc-400">Roundtrip Latency</span>
            <span className="font-mono text-xs font-medium text-zinc-800 dark:text-zinc-200">
              {latencyMs} ms
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-800 dark:text-red-300">
            <strong>Diagnostic Error:</strong> {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            Raw Response Payload
          </label>
          <pre className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto">
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline"
          >
            &larr; Return to Home
          </Link>
          <Link
            href="/health-check"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium transition-colors"
          >
            Re-test Connectivity
          </Link>
        </div>
      </div>
    </div>
  );
}
