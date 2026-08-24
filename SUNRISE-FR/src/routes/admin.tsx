import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Bookings", to: "/admin/bookings" },
  { label: "Ticketing", to: "/admin/ticketing" },
  { label: "Travel Statistics", to: "/admin/statistics" },
];

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RoleGuard role="TRAVEL_ADMIN">
      <AppShell nav={nav}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
