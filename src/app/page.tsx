"use client";

import { Suspense } from "react";
import { AppLayout } from "@/components/app-layout";

function AppContent() {
  return <AppLayout />;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AppContent />
    </Suspense>
  );
}
