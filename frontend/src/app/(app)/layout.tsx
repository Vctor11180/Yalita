"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { FullPageSpinner } from "@/components/ui";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && !authenticated) router.replace("/onboarding");
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) return <FullPageSpinner />;

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="hidden md:block"><AppSidebar /></div>
      <div className="md:ml-60 flex flex-col min-h-screen pb-20 md:pb-0">
        <AppTopbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
