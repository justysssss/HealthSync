"use client"

import { useAuth } from "@/context/AuthContext";
import { HomePage } from "@/components/home-page";
import { AppShell } from "@/components/app-shell";

export default function DashboardPage() {
  useAuth();

  return (
     <AppShell>
          <HomePage/>
    </AppShell>
  );
}
