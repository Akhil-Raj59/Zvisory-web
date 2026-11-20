import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { AttributionTracker } from "@/components/common/AttributionTracker";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zvisory | Advisory & Management Platform",
  description: "Zvisory Advisory & Management Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider initialUser={user}>
          <Suspense fallback={null}>
            <AttributionTracker />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
