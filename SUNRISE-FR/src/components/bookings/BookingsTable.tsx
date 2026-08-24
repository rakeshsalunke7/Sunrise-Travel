import type { ReactNode } from "react";

import type { Booking } from "@/api/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";

export function travelerOf(booking: Booking): string {
  return booking.employeeName ?? booking.employeeEmail ?? booking.userEmail ?? "—";
}

export function BookingsTable({
  bookings,
  showTraveler = false,
  onView,
  renderActions,
}: {
  bookings: Booking[];
  showTraveler?: boolean;
  onView?: (booking: Booking) => void;
  renderActions?: (booking: Booking) => ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/60">
            <TableHead>Reference</TableHead>
            {showTraveler && <TableHead>Traveller</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Route</TableHead>
            <TableHead>Travel date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.bookingReference ?? `#${booking.id}`}
              </TableCell>
              {showTraveler && (
                <TableCell className="max-w-44 truncate">{travelerOf(booking)}</TableCell>
              )}
              <TableCell>{booking.bookingType}</TableCell>
              <TableCell>{booking.itemReference ?? "—"}</TableCell>
              <TableCell className="whitespace-nowrap">
                {booking.origin || booking.destination
                  ? `${booking.origin ?? "—"} → ${booking.destination ?? "—"}`
                  : "—"}
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(booking.travelDate)}</TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {formatCurrency(booking.amount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={booking.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDateTime(booking.createdAt)}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">
                {renderActions ? (
                  renderActions(booking)
                ) : onView ? (
                  <Button variant="outline" size="sm" onClick={() => onView(booking)}>
                    View
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
