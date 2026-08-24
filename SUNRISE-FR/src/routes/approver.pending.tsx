import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { approvalApi } from "@/api/approvalApi";
import { getApiErrorMessage } from "@/api/axiosClient";
import type { Booking } from "@/api/types";
import { travelerOf } from "@/components/bookings/BookingsTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatDate } from "@/lib/format";

export const Route = createFileRoute("/approver/pending")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Pending Approvals — Sunrise Travel" },
      {
        name: "description",
        content: "Review, approve or reject employee travel requests awaiting your decision.",
      },
      { property: "og:title", content: "Pending Approvals — Sunrise Travel" },
      { property: "og:description", content: "Approve or reject pending corporate travel requests." },
    ],
  }),
  component: PendingApprovalsPage,
});

type Action = { booking: Booking; type: "approve" | "reject" };

function PendingApprovalsPage() {
  const queryClient = useQueryClient();
  const [action, setAction] = useState<Action | null>(null);
  const [comment, setComment] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["approvals", "pending"],
    queryFn: approvalApi.pending,
  });

  const mutation = useMutation({
    mutationFn: ({ booking, type }: Action) =>
      type === "approve"
        ? approvalApi.approve(booking.id, comment)
        : approvalApi.reject(booking.id, comment),
    onSuccess: (_result, variables) => {
      toast.success(
        variables.type === "approve"
          ? `Booking ${variables.booking.bookingReference ?? variables.booking.id} approved`
          : `Booking ${variables.booking.bookingReference ?? variables.booking.id} rejected`,
      );
      setAction(null);
      setComment("");
      void queryClient.invalidateQueries({ queryKey: ["approvals"] });
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, "The decision could not be saved."));
    },
  });

  const bookings = data ?? [];

  return (
    <>
      <PageHeader
        title="Pending approvals"
        description="Travel requests from your team awaiting a decision."
      />

      <section className="panel overflow-hidden">
        {isLoading && <RowSkeleton rows={4} />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && bookings.length === 0 && (
          <EmptyState
            icon={<CheckCircle2 className="size-5" />}
            title="No pending approvals"
            description="New travel requests will appear here as soon as employees submit them."
          />
        )}
        {!isLoading && !isError && bookings.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/60">
                  <TableHead>Reference</TableHead>
                  <TableHead>Traveller</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Travel date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.bookingReference ?? `#${booking.id}`}
                    </TableCell>
                    <TableCell className="max-w-44 truncate">{travelerOf(booking)}</TableCell>
                    <TableCell>{booking.bookingType}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {booking.origin ?? "—"} → {booking.destination ?? "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(booking.travelDate)}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatCurrency(booking.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setComment("");
                            setAction({ booking, type: "approve" });
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setComment("");
                            setAction({ booking, type: "reject" });
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <Dialog open={Boolean(action)} onOpenChange={(open) => !open && setAction(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {action?.type === "approve" ? (
                <CheckCircle2 className="size-5 text-success" />
              ) : (
                <XCircle className="size-5 text-destructive" />
              )}
              {action?.type === "approve" ? "Approve travel request" : "Reject travel request"}
            </DialogTitle>
            <DialogDescription>
              Confirm the details below. The employee will see your decision immediately.
            </DialogDescription>
          </DialogHeader>

          {action && (
            <dl className="divide-y divide-border rounded-md border border-border text-sm">
              <Row
                label="Booking reference"
                value={action.booking.bookingReference ?? `#${action.booking.id}`}
              />
              <Row label="Employee" value={travelerOf(action.booking)} />
              <Row label="Destination" value={action.booking.destination ?? "—"} />
              <Row label="Amount" value={formatCurrency(action.booking.amount)} />
            </dl>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              rows={3}
              placeholder="Add a note for the employee…"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAction(null)} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button
              variant={action?.type === "reject" ? "destructive" : "default"}
              onClick={() => action && mutation.mutate(action)}
              disabled={mutation.isPending}
            >
              {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {action?.type === "approve" ? "Approve request" : "Reject request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
