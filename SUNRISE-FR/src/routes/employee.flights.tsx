import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Plane, Search } from "lucide-react";
import { useState } from "react";

import { getApiErrorMessage } from "@/api/axiosClient";
import { flightApi, type FlightSearchParams } from "@/api/flightApi";
import type { Flight } from "@/api/types";
import {
  BookingConfirmDialog,
  type BookingDraft,
} from "@/components/booking/BookingConfirmDialog";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatTime } from "@/lib/format";

const CABIN_CLASSES = ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS"];

export const Route = createFileRoute("/employee/flights")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Flight Search — Sunrise Travel" },
      {
        name: "description",
        content: "Search corporate flights by route, date and cabin class and book within policy.",
      },
      { property: "og:title", content: "Flight Search — Sunrise Travel" },
      { property: "og:description", content: "Search and book corporate flights within policy." },
    ],
  }),
  component: FlightsPage,
});

function FlightsPage() {
  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    cabinClass: "ECONOMY",
  });
  const [query, setQuery] = useState<FlightSearchParams | null>(null);
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["flights", query],
    queryFn: () => flightApi.search(query as FlightSearchParams),
    enabled: Boolean(query),
  });

  function handleSearch(event: React.FormEvent) {
  event.preventDefault();

  if (
    !form.origin.trim() ||
    !form.destination.trim() ||
    !form.departureDate ||
    !form.cabinClass
  ) {
    return;
  }

  setQuery({
    origin: form.origin.trim(),
    destination: form.destination.trim(),
    departureDate: form.departureDate,
    cabinClass: form.cabinClass,
    passengers: 1,
  });
}

  function book(flight: Flight) {
  setDraft({
    title: `${flight.airline} ${flight.flightNumber}`,
    subtitle: `${flight.origin} to ${flight.destination}`,
    rows: [
      { label: "Flight", value: `${flight.airline} ${flight.flightNumber}` },
      { label: "Route", value: `${flight.origin} → ${flight.destination}` },
      { label: "Departure", value: formatTime(flight.departureTime) },
      { label: "Arrival", value: formatTime(flight.arrivalTime) },
      { label: "Cabin class", value: flight.cabinClass },
    ],
    request: {
  bookingType: "FLIGHT",
  itemReference: flight.flightNumber,
  origin: flight.origin,
  destination: flight.destination,
  travelDate: `${query?.departureDate}T${flight.departureTime}`,
  amount: flight.price,
  details: `${flight.airline} ${flight.flightNumber} - ${flight.origin} to ${flight.destination}`,
  cabinOrCategory: flight.cabinClass,
   },
  });
}

  const flights = data ?? [];

  return (
    <>
      <PageHeader
        title="Flight search"
        description="Search company fares and submit your travel request for approval."
      />

      <form onSubmit={handleSearch} className="panel p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <Field label="From">
            <Input
              placeholder="NEW YORK"
              value={form.origin}
              onChange={(event) => setForm({ ...form, origin: event.target.value })}
            />
          </Field>
          <Field label="To">
            <Input
              placeholder="LAS VEGAS"
              value={form.destination}
              onChange={(event) => setForm({ ...form, destination: event.target.value })}
            />
          </Field>
          <Field label="Departure date">
            <Input
              type="date"
              value={form.departureDate}
              onChange={(event) => setForm({ ...form, departureDate: event.target.value })}
            />
          </Field>
          <Field label="Cabin class">
            <Select
              value={form.cabinClass}
              onValueChange={(value) => setForm({ ...form, cabinClass: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CABIN_CLASSES.map((cabin) => (
                  <SelectItem key={cabin} value={cabin}>
                    {cabin.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={isFetching} className="w-full sm:w-auto">
            <Search className="mr-2 size-4" />
            {isFetching ? "Searching…" : "Search flights"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        {!query && (
          <div className="panel">
            <EmptyState
              icon={<Plane className="size-5" />}
              title="Start a flight search"
              description="Enter your route and travel date to see available company fares."
            />
          </div>
        )}

        {query && isFetching && (
          <div className="panel">
            <RowSkeleton rows={3} />
          </div>
        )}

        {query && !isFetching && isError && (
          <div className="panel">
            <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
          </div>
        )}

        {query && !isFetching && !isError && flights.length === 0 && (
          <div className="panel">
            <EmptyState
              icon={<Plane className="size-5" />}
              title="No flights found for your search"
              description="Try a different date, route or cabin class."
            />
          </div>
        )}

        {query && !isFetching && !isError && flights.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {flights.length} flight{flights.length === 1 ? "" : "s"} available
            </p>
            {flights.map((flight, index) => (
              <div
                key={`${flight.flightNumber}-${index}`}
                className="panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center"
              >
                <div className="lg:w-52">
                  <p className="text-sm font-semibold text-foreground">{flight.airline}</p>
                  <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
                </div>

                <div className="flex flex-1 items-center gap-4">
                  <div>
                    <p className="text-base font-semibold">{formatTime(flight.departureTime)}</p>
                    <p className="text-xs text-muted-foreground">{flight.origin}</p>
                  </div>
                  <div className="flex-1 border-t border-dashed border-border" />
                  <div className="text-right">
                    <p className="text-base font-semibold">{formatTime(flight.arrivalTime)}</p>
                    <p className="text-xs text-muted-foreground">{flight.destination}</p>
                  </div>
                </div>

                <div className="lg:w-40 lg:text-center">
                  <p className="text-sm">{flight.cabinClass}</p>
                  <p className="text-xs text-muted-foreground">
                    {flight.availableSeats != null
                      ? `${flight.availableSeats} seats left`
                      : "Seats on request"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-3 lg:w-48 lg:justify-end lg:border-0 lg:pt-0">
                  <p className="text-lg font-semibold">{formatCurrency(flight.price)}</p>
                  <Button onClick={() => book(flight)}>Book</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingConfirmDialog draft={draft} onClose={() => setDraft(null)} />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
