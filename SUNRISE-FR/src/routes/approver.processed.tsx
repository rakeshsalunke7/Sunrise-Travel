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

const FILTERS = ["ALL", "APPROVED", "REJECTED", "TICKETED", "CANCELLED"];

export const Route = createFileRoute("/approver/processed")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Processed Requests — Sunrise Travel" },
      {
        name: "description",
        content: "History of travel requests you have already approved or rejected.",
      },
      { property: "og:title", content: "Processed Requests — Sunrise Travel" },
      { property: "og:description", content: "Approved and rejected travel request history." },
    ],
  }),
  component: ProcessedPage,
});

function ProcessedPage() {
  const [filter, setFilter] = useState("ALL");
  const [selected, setSelected] = useState<Booking | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookings", "processed"],
    queryFn: bookingApi.processedBookings,
  });

  const bookings = useMemo(() => {
    const processed = (data ?? []).filter(
      (booking) => String(booking.status).toUpperCase() !== "PENDING",
    );
    if (filter === "ALL") return processed;
    return processed.filter((booking) => String(booking.status).toUpperCase() === filter);
  }, [data, filter]);

  return (
    <>
      <PageHeader
        title="Processed requests"
        description="Travel requests that already have a decision."
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
        {isLoading && <RowSkeleton rows={4} />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <EmptyState
            title="No processed requests"
            description="Approved and rejected requests will be listed here."
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
