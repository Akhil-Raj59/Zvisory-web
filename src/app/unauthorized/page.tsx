import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Denied | Zvisory",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950">
      <div className="w-full max-w-md text-center space-y-6">
        <div>
          <div className="text-5xl font-black text-zinc-300 dark:text-zinc-700">403</div>
          <h1 className="text-2xl font-bold tracking-tight mt-2">Access Denied</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            You do not have permission to view this page.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium transition-colors"
          >
            Return to Home
          </Link>
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition-colors text-zinc-700 dark:text-zinc-300"
          >
            Sign In with a Different Account
          </Link>
        </div>
      </div>
    </div>
  );
}
