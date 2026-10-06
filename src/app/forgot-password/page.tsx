import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | Zvisory",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Suspense fallback={<div className="text-sm text-zinc-500">Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
