import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Logo } from "@/components/brand/Logo";
import { roleHome } from "@/lib/authStore";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sunrise Travel — Corporate Travel Management" },
      {
        name: "description",
        content:
          "Sunrise Travel is the internal corporate travel platform for booking flights and hotels, managing approvals and issuing tickets.",
      },
      { property: "og:title", content: "Sunrise Travel — Corporate Travel Management" },
      {
        property: "og:description",
        content: "Book flights and hotels, manage travel approvals and ticketing in one platform.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: session ? roleHome[session.role] : "/login", replace: true });
  }, [session, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface">
      <Logo />
      <p className="text-sm text-muted-foreground">Loading your workspace…</p>
    </div>
  );
}
