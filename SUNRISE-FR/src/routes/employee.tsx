import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell, type NavItem } from "@/components/layout/AppShell";
import { RoleGuard } from "@/components/layout/RoleGuard";

const nav: NavItem[] = [
  { label: "Dashboard", to: "/employee", exact: true },
  { label: "Flights", to: "/employee/flights" },
  { label: "Hotels", to: "/employee/hotels" },
  { label: "My Bookings", to: "/employee/bookings" },
  { label: "Profile", to: "/employee/profile" },
];

export const Route = createFileRoute("/employee")({
  ssr: false,
  component: EmployeeLayout,
});

function EmployeeLayout() {
  return (
    <RoleGuard role="EMPLOYEE">
      <AppShell nav={nav}>
        <Outlet />
      </AppShell>
    </RoleGuard>
  );
}
