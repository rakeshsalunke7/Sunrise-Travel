import type { Booking } from "@/api/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { travelerOf } from "./BookingsTable";

export function BookingDetailsDialog({
  booking,
  onClose,
  showTraveler = false,
}: {
  booking: Booking | null;
  onClose: () => void;
  showTraveler?: boolean;
}) {
  return (
    <Dialog open={Boolean(booking)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Booking {booking?.bookingReference ?? (booking ? `#${booking.id}` : "")}
          </DialogTitle>
          <DialogDescription>{booking?.details ?? "Travel request details"}</DialogDescription>
        </DialogHeader>
        {booking && (
          <dl className="divide-y divide-border rounded-md border border-border text-sm">
            <Row label="Type" value={String(booking.bookingType)} />
            {showTraveler && <Row label="Traveller" value={travelerOf(booking)} />}
            <Row label="Item reference" value={booking.itemReference ?? "—"} />
            <Row label="Origin" value={booking.origin ?? "—"} />
            <Row label="Destination" value={booking.destination ?? "—"} />
            <Row label="Cabin / category" value={booking.cabinOrCategory ?? "—"} />
            <Row label="Travel date" value={formatDateTime(booking.travelDate)} />
            <Row label="Amount" value={formatCurrency(booking.amount)} />
            <Row label="Created" value={formatDateTime(booking.createdAt)} />
            <div className="flex items-center justify-between gap-4 px-3 py-2">
              <dt className="text-muted-foreground">Status</dt>
              <dd>
                <StatusBadge status={booking.status} />
              </dd>
            </div>
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-3 py-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}
