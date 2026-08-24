import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, MapPin, Search } from "lucide-react";
import { useState } from "react";

import { getApiErrorMessage } from "@/api/axiosClient";
import { hotelApi, type HotelSearchParams } from "@/api/hotelApi";
import type { Hotel } from "@/api/types";
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
import { formatCurrency, toLocalDateTime } from "@/lib/format";

const CATEGORIES = ["STANDARD", "DELUXE", "PREMIUM", "LUXURY"];

export const Route = createFileRoute("/employee/hotels")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Hotel Search — Sunrise Travel" },
      {
        name: "description",
        content:
          "Search corporate hotels by city, dates and category, and book approved stays.",
      },
      { property: "og:title", content: "Hotel Search — Sunrise Travel" },
      { property: "og:description", content: "Find and book corporate hotel stays." },
    ],
  }),
  component: HotelsPage,
});

function hotelName(hotel: Hotel) {
  return hotel.hotelName ?? hotel.name ?? "Hotel";
}

function HotelsPage() {
  const [form, setForm] = useState({
    city: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    category: "STANDARD",
  });

  const [query, setQuery] = useState<HotelSearchParams | null>(null);
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["hotels", query],
    queryFn: () => hotelApi.search(query as HotelSearchParams),
    enabled: Boolean(query),
  });

 function handleSearch(event: React.FormEvent) {
  event.preventDefault();

  setQuery({
    city: form.city.trim(),
    checkIn: form.checkIn,
    checkOut: form.checkOut,
    guests: form.guests,
  });
}

  function book(hotel: Hotel) {
    const travelDate = form.checkIn
      ? toLocalDateTime(form.checkIn, "12:00")
      : toLocalDateTime(new Date().toISOString().slice(0, 10), "12:00");

    setDraft({
      title: hotelName(hotel),
      subtitle: `${hotel.city} · ${hotel.category}`,
      rows: [
        { label: "Hotel", value: hotelName(hotel) },
        { label: "City", value: hotel.city },
        { label: "Category", value: hotel.category },
        { label: "Room type", value: hotel.roomType ?? "Standard room" },
        { label: "Check-in", value: form.checkIn || "—" },
        { label: "Check-out", value: form.checkOut || "—" },
      ],
      request: {
        bookingType: "HOTEL",
        itemReference: hotelName(hotel),
        origin: hotel.city,
        destination: hotel.city,
        travelDate,
        amount: hotel.pricePerNight,
        details: `${hotelName(hotel)} - ${hotel.city} - ${hotel.roomType ?? hotel.category}`,
        cabinOrCategory: hotel.category,
      },
    });
  }

  const hotels = data ?? [];

  return (
    <>
      <PageHeader
        title="Hotel search"
        description="Company-approved hotels with negotiated nightly rates."
      />

      <form onSubmit={handleSearch} className="panel p-4 sm:p-5">
        <div className="grid gap-4 md:grid-cols-5">
          <Field label="City">
            <Input
              placeholder="NEW YORK"
              value={form.city}
              onChange={(event) =>
                setForm({ ...form, city: event.target.value })
              }
            />
          </Field>

          <Field label="Check-in">
            <Input
              type="date"
              value={form.checkIn}
              onChange={(event) =>
                setForm({ ...form, checkIn: event.target.value })
              }
            />
          </Field>

          <Field label="Check-out">
            <Input
              type="date"
              value={form.checkOut}
              onChange={(event) =>
                setForm({ ...form, checkOut: event.target.value })
              }
            />
          </Field>

          <Field label="Guests">
            <Input
              type="number"
              min={1}
              value={form.guests}
              onChange={(event) =>
                setForm({
                  ...form,
                  guests: Math.max(1, Number(event.target.value)),
                })
              }
            />
          </Field>

          <Field label="Hotel category">
            <Select
              value={form.category}
              onValueChange={(value) =>
                setForm({ ...form, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            disabled={isFetching}
            className="w-full sm:w-auto"
          >
            <Search className="mr-2 size-4" />
            {isFetching ? "Searching…" : "Search hotels"}
          </Button>
        </div>
      </form>

      <div className="mt-6">
        {!query && (
          <div className="panel">
            <EmptyState
              icon={<BedDouble className="size-5" />}
              title="Start a hotel search"
              description="Enter a city and your stay dates to see available corporate rates."
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
            <ErrorState
              message={getApiErrorMessage(error)}
              onRetry={() => refetch()}
            />
          </div>
        )}

        {query && !isFetching && !isError && hotels.length === 0 && (
          <div className="panel">
            <EmptyState
              icon={<BedDouble className="size-5" />}
              title="No hotels found for your search"
              description="Try a different city or category."
            />
          </div>
        )}

        {query && !isFetching && !isError && hotels.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {hotels.length} propert{hotels.length === 1 ? "y" : "ies"} available
            </p>

            {hotels.map((hotel, index) => (
              <div
                key={`${hotelName(hotel)}-${index}`}
                className="panel flex flex-col gap-4 p-4 lg:flex-row lg:items-start"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">
                      {hotelName(hotel)}
                    </h3>

                    <span className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary-foreground">
                      {hotel.category}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {hotel.address
                      ? `${hotel.address}, ${hotel.city}`
                      : hotel.city}
                  </p>

                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Room type
                      </dt>
                      <dd>{hotel.roomType ?? "Standard room"}</dd>
                    </div>

                    <div>
                      <dt className="text-xs text-muted-foreground">
                        Amenities
                      </dt>
                      <dd>{hotel.amenities ?? "—"}</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-3 lg:w-52 lg:flex-col lg:items-end lg:border-0 lg:pt-0">
                  <div className="lg:text-right">
                    <p className="text-lg font-semibold">
                      {formatCurrency(hotel.pricePerNight)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      per night
                      {hotel.availableRooms != null
                        ? ` · ${hotel.availableRooms} rooms left`
                        : ""}
                    </p>
                  </div>

                  <Button onClick={() => book(hotel)}>Book</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingConfirmDialog
        draft={draft}
        onClose={() => setDraft(null)}
      />
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}