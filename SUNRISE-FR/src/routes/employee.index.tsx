import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { BedDouble, Plane, Search } from "lucide-react";
import { useState } from "react";

import { getApiErrorMessage } from "@/api/axiosClient";
import { bookingApi } from "@/api/bookingApi";
import type { Booking } from "@/api/types";
import { BookingDetailsDialog } from "@/components/bookings/BookingDetailsDialog";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/employee/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Employee Dashboard — Sunrise Travel" },
      {
        name: "description",
        content:
          "Your corporate travel workspace: quick flight and hotel search, recent bookings and approval status.",
      },
      { property: "og:title", content: "Employee Dashboard — Sunrise Travel" },
      {
        property: "og:description",
        content: "Quick search, recent bookings and travel status for Sunrise employees.",
      },
    ],
  }),
  component: EmployeeDashboard,
});

function EmployeeDashboard() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Booking | null>(null);
  const [flightForm, setFlightForm] = useState({ origin: "", destination: "" });
  const [hotelCity, setHotelCity] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookings", "my"],
    queryFn: bookingApi.myBookings,
  });

  const bookings = data ?? [];
  const recent = [...bookings]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5);

  const count = (status: string) =>
    bookings.filter((booking) => String(booking.status).toUpperCase() === status).length;
  const totalSpend = bookings
    .filter((booking) => ["APPROVED", "TICKETED"].includes(String(booking.status).toUpperCase()))
    .reduce((sum, booking) => sum + (booking.amount ?? 0), 0);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${session?.email?.split("@")[0] ?? "traveller"}`}
        description="Plan a trip, track approvals and review your travel history."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          className="panel p-4"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({ to: "/employee/flights" });
          }}
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Plane className="size-4 text-primary" /> Quick flight search
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input
                placeholder="Pune"
                value={flightForm.origin}
                onChange={(event) => setFlightForm({ ...flightForm, origin: event.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input
                placeholder="Delhi"
                value={flightForm.destination}
                onChange={(event) =>
                  setFlightForm({ ...flightForm, destination: event.target.value })
                }
              />
            </div>
          </div>
          <Button type="submit" variant="outline" className="mt-3 w-full sm:w-auto">
            <Search className="mr-2 size-4" /> Search flights
          </Button>
        </form>

        <form
          className="panel p-4"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({ to: "/employee/hotels" });
          }}
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <BedDouble className="size-4 text-primary" /> Quick hotel search
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">City</Label>
              <Input
                placeholder="Delhi"
                value={hotelCity}
                onChange={(event) => setHotelCity(event.target.value)}
              />
            </div>
          </div>
          <Button type="submit" variant="outline" className="mt-3 w-full sm:w-auto">
            <Search className="mr-2 size-4" /> Search hotels
          </Button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total bookings" value={String(bookings.length)} loading={isLoading} />
        <SummaryCard label="Awaiting approval" value={String(count("PENDING"))} loading={isLoading} />
        <SummaryCard label="Ticketed trips" value={String(count("TICKETED"))} loading={isLoading} />
        <SummaryCard label="Approved spend" value={formatCurrency(totalSpend)} loading={isLoading} />
      </div>

      <section className="panel mt-6">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Recent bookings</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/employee/bookings" })}>
            View all
          </Button>
        </header>
        {isLoading && <RowSkeleton rows={3} />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && recent.length === 0 && (
          <EmptyState
            title="No bookings found"
            description="Your travel requests will appear here once you book a flight or hotel."
          />
        )}
        {!isLoading && !isError && recent.length > 0 && (
          <BookingsTable bookings={recent} onView={setSelected} />
        )}
      </section>

      <BookingDetailsDialog booking={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function SummaryCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading?: boolean;
}) {
  return (
    <div className="panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{loading ? "—" : value}</p>
    </div>
  );
}
