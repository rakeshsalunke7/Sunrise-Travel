import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/api/axiosClient";
import { bookingApi } from "@/api/bookingApi";
import type { Booking, BookingRequest } from "@/api/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";

export type BookingDraft = {
  request: BookingRequest;
  title: string;
  subtitle: string;
  rows: Array<{ label: string; value: string }>;
};

export function BookingConfirmDialog({
  draft,
  onClose,
}: {
  draft: BookingDraft | null;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Booking | null>(null);

  function close() {
    setError(null);
    setCreated(null);
    setSubmitting(false);
    onClose();
  }

  async function confirm() {
    if (!draft) return;
    setSubmitting(true);
    setError(null);
    try {
      const booking = await bookingApi.create(draft.request);
      setCreated(booking);
      toast.success("Your booking was created successfully");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Booking could not be created. It may violate your corporate travel policy.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={Boolean(draft)} onOpenChange={(open) => !open && close()}>
      <DialogContent className="sm:max-w-lg">
        {created ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                Booking confirmed
              </DialogTitle>
              <DialogDescription>
                Your travel request has been submitted for approval.
              </DialogDescription>
            </DialogHeader>
            <dl className="divide-y divide-border rounded-md border border-border text-sm">
              <Row label="Booking reference" value={created.bookingReference ?? `#${created.id}`} />
              <Row label="Item" value={created.itemReference ?? draft?.request.itemReference ?? "—"} />
              <Row
                label="Travel date"
                value={formatDateTime(created.travelDate ?? draft?.request.travelDate)}
              />
              <Row label="Amount" value={formatCurrency(created.amount ?? draft?.request.amount)} />
              <div className="flex items-center justify-between gap-4 px-3 py-2">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={created.status ?? "PENDING"} />
                </dd>
              </div>
            </dl>
            <DialogFooter>
              <Button onClick={close}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Review and confirm booking</DialogTitle>
              <DialogDescription>{draft?.subtitle}</DialogDescription>
            </DialogHeader>
            <div className="rounded-md border border-border">
              <div className="border-b border-border bg-secondary px-3 py-2 text-sm font-semibold">
                {draft?.title}
              </div>
              <dl className="divide-y divide-border text-sm">
                {draft?.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
                <Row
                  label="Total fare"
                  value={formatCurrency(draft?.request.amount)}
                  emphasise
                />
              </dl>
            </div>
            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={close} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={confirm} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Confirm booking
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label,
  value,
  emphasise,
}: {
  label: string;
  value: string;
  emphasise?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={emphasise ? "font-semibold text-foreground" : "text-foreground"}>{value}</dd>
    </div>
  );
}
