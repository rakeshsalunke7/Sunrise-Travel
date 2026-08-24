import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, TicketCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/api/axiosClient";
import { bookingApi } from "@/api/bookingApi";
import { ticketingApi } from "@/api/ticketingApi";
import type { Booking } from "@/api/types";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";

const FILTERS = ["APPROVED", "TICKETED", "ALL"];

export const Route = createFileRoute("/admin/ticketing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Ticketing — Sunrise Travel" },
      {
        name: "description",
        content: "Issue tickets for approved travel bookings and cancel ticketed itineraries.",
      },
      { property: "og:title", content: "Ticketing — Sunrise Travel" },
      { property: "og:description", content: "Issue and cancel corporate travel tickets." },
    ],
  }),
  component: TicketingPage,
});

type PendingAction = { booking: Booking; type: "issue" | "cancel" };

function TicketingPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("APPROVED");
  const [action, setAction] = useState<PendingAction | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["bookings", "all"],
    queryFn: bookingApi.allBookings,
  });

  const mutation = useMutation({
    mutationFn: ({ booking, type }: PendingAction) =>
      type === "issue" ? ticketingApi.issue(booking.id) : ticketingApi.cancel(booking.id),
    onSuccess: (_result, variables) => {
      toast.success(
        variables.type === "issue"
          ? `Ticket issued for ${variables.booking.bookingReference ?? variables.booking.id}`
          : `Ticket cancelled for ${variables.booking.bookingReference ?? variables.booking.id}`,
      );
      setAction(null);
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (err) => toast.error(getApiErrorMessage(err, "The ticketing action failed.")),
  });

  const bookings = useMemo(() => {
    const list = data ?? [];
    if (filter === "ALL") return list;
    return list.filter((booking) => String(booking.status).toUpperCase() === filter);
  }, [data, filter]);

  return (
    <>
      <PageHeader
        title="Ticketing"
        description="Issue tickets for approved bookings and cancel ticketed trips."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filter === option ? "default" : "outline"}
            onClick={() => setFilter(option)}
          >
            {option === "ALL" ? "All bookings" : option.charAt(0) + option.slice(1).toLowerCase()}
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
            icon={<TicketCheck className="size-5" />}
            title="Nothing to ticket"
            description="Approved bookings ready for ticketing will appear here."
          />
        )}
        {!isLoading && !isError && bookings.length > 0 && (
          <BookingsTable
            bookings={bookings}
            showTraveler
            renderActions={(booking) => {
              const status = String(booking.status).toUpperCase();
              if (status === "APPROVED") {
                return (
                  <Button size="sm" onClick={() => setAction({ booking, type: "issue" })}>
                    Issue ticket
                  </Button>
                );
              }
              if (status === "TICKETED") {
                return (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setAction({ booking, type: "cancel" })}
                  >
                    Cancel ticket
                  </Button>
                );
              }
              return <span className="text-xs text-muted-foreground">No action</span>;
            }}
          />
        )}
      </section>

      <AlertDialog open={Boolean(action)} onOpenChange={(open) => !open && setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action?.type === "issue" ? "Issue ticket?" : "Cancel this ticket?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action?.type === "issue"
                ? "The booking status will change to TICKETED and the traveller will be notified by the travel desk."
                : "The booking status will change to CANCELLED. This cannot be undone from this screen."}
              {action && (
                <span className="mt-3 block text-foreground">
                  {action.booking.bookingReference ?? `#${action.booking.id}`} ·{" "}
                  {action.booking.itemReference ?? "—"} · {formatCurrency(action.booking.amount)}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutation.isPending}>Keep as is</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                if (action) mutation.mutate(action);
              }}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {action?.type === "issue" ? "Issue ticket" : "Cancel ticket"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
