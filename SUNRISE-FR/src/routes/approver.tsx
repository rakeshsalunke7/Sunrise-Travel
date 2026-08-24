import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/approver", exact: true },
  { label: "Pending Approvals", to: "/approver/pending" },
  { label: "Processed Requests", to: "/approver/processed" },
];

export const Route = createFileRoute("/approver")({
  ssr: false,
  component: ApproverLayout,
});

function ApproverLayout() {
  return (
    <RoleGuard role="TRAVEL_APPROVER">
      <AppShell nav={nav}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
