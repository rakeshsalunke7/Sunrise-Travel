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

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED", "TICKETED", "CANCELLED"];

export const Route = createFileRoute("/employee/bookings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Bookings — Sunrise Travel" },
      {
        name: "description",
        content: "Track your corporate travel bookings, approval status and ticketing details.",
      },
      { property: "og:title", content: "My Bookings — Sunrise Travel" },
      { property: "og:description", content: "Track approval and ticketing status of your trips." },
    ],
  }),
  component: MyBookingsPage,
});

function MyBookingsPage() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookings", "my"],
    queryFn: bookingApi.myBookings,
  });

  const bookings = useMemo(() => {
    const list = data ?? [];
    if (filter === "ALL") return list;
    return list.filter((booking) => String(booking.status).toUpperCase() === filter);
  }, [data, filter]);

  return (
    <>
      <PageHeader
        title="My bookings"
        description="All travel requests you have submitted, with current status."
      />

      <div className="mb-4 flex flex-wrap gap-2">
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

      <section className="panel overflow-hidden">
        {isLoading && <RowSkeleton rows={5} />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <EmptyState
            title="No bookings found"
            description={
              filter === "ALL"
                ? "Book a flight or hotel to create your first travel request."
                : `You have no ${filter.toLowerCase()} bookings.`
            }
          />
        )}
        {!isLoading && !isError && bookings.length > 0 && (
          <BookingsTable bookings={bookings} onView={setSelected} />
        )}
      </section>

      <BookingDetailsDialog booking={selected} onClose={() => setSelected(null)} />
    </>
  );
}
