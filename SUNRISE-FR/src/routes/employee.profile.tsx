import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/lib/authStore";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/employee/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Profile — Sunrise Travel" },
      {
        name: "description",
        content: "Review your Sunrise Travel account details, role and session information.",
      },
      { property: "og:title", content: "My Profile — Sunrise Travel" },
      { property: "og:description", content: "Your Sunrise Travel account and role details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="My profile" description="Account information from your travel login." />

      <div className="panel max-w-xl divide-y divide-border">
        <Row label="Email" value={session?.email ?? "—"} />
        <Row label="Role" value={session ? roleLabel[session.role] : "—"} />
        <Row label="Session" value="Active for this browser session only" />
        <div className="flex items-center justify-between gap-4 p-4">
          <div>
            <p className="text-sm font-medium">Sign out</p>
            <p className="text-xs text-muted-foreground">
              Ends your session on this device immediately.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              signOut();
              navigate({ to: "/login", replace: true });
            }}
          >
            <LogOut className="mr-2 size-4" /> Logout
          </Button>
        </div>
      </div>

      <p className="mt-4 max-w-xl text-xs text-muted-foreground">
        Profile details such as employee ID, department and travel policy limits are maintained by
        your travel administrator in the corporate travel system.
      </p>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
