import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { getApiErrorMessage } from "@/api/axiosClient";
import { bookingApi } from "@/api/bookingApi";
import type { Booking } from "@/api/types";
import { BookingDetailsDialog } from "@/components/bookings/BookingDetailsDialog";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "TICKETED", "CANCELLED"];

export const Route = createFileRoute("/admin/bookings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "All Bookings — Sunrise Travel" },
      {
        name: "description",
        content: "Search and review every corporate travel booking across the organisation.",
      },
      { property: "og:title", content: "All Bookings — Sunrise Travel" },
      { property: "og:description", content: "Company-wide corporate travel booking register." },
    ],
  }),
  component: AdminBookingsPage,
});

function AdminBookingsPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookings", "all"],
    queryFn: bookingApi.allBookings,
  });

  const bookings = useMemo(() => {
    let list = data ?? [];
    if (filter !== "ALL") {
      list = list.filter((booking) => String(booking.status).toUpperCase() === filter);
    }
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter((booking) =>
        [
          booking.bookingReference,
          booking.itemReference,
          booking.origin,
          booking.destination,
          booking.employeeEmail ?? booking.userEmail,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(term)),
      );
    }
    return list;
  }, [data, filter, search]);

  return (
    <>
      <PageHeader
        title="All bookings"
        description="Complete travel booking register for the organisation."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={filter === option ? "default" : "outline"}
              onClick={() => setFilter(option)}
            >
              {option === "ALL" ? "All" : option.charAt(0) + option.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
        <Input
          className="sm:w-72"
          placeholder="Search reference, route or traveller"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <section className="panel overflow-hidden">
        {isLoading && <RowSkeleton rows={5} />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <EmptyState
            title="No bookings found"
            description="Adjust your filters or search to see more results."
          />
        )}
        {!isLoading && !isError && bookings.length > 0 && (
          <BookingsTable bookings={bookings} showTraveler onView={setSelected} />
        )}
      </section>

      <BookingDetailsDialog booking={selected} onClose={() => setSelected(null)} showTraveler />
    </>
  );
}
