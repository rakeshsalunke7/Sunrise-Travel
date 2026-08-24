import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { getApiErrorMessage } from "@/api/axiosClient";
import { dashboardApi } from "@/api/dashboardApi";
import { ErrorState } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/admin/statistics")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Travel Statistics — Sunrise Travel" },
      {
        name: "description",
        content: "Corporate travel statistics reported by the travel service: volumes and spend.",
      },
      { property: "og:title", content: "Travel Statistics — Sunrise Travel" },
      { property: "og:description", content: "Corporate travel volumes and spend statistics." },
    ],
  }),
  component: StatisticsPage,
});

function StatisticsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.summary,
  });

  const rows = data
    ? [
        { label: "Total bookings", value: String(data.totalBookings) },
        { label: "Bookings created today", value: String(data.todayBookings) },
        { label: "Pending approval", value: String(data.pendingBookings) },
        { label: "Approved", value: String(data.approvedBookings) },
        { label: "Ticketed", value: String(data.ticketedBookings) },
        { label: "Rejected", value: String(data.rejectedBookings) },
        { label: "Cancelled", value: String(data.cancelledBookings) },
        { label: "Total travel spend", value: formatCurrency(data.totalTravelSpend) },
        { label: "Most travelled city", value: data.mostTravelledCity || "Not available" },
      ]
    : [];

  return (
    <>
      <PageHeader
        title="Travel statistics"
        description="All figures come directly from the travel service summary report."
      />

      <section className="panel max-w-2xl overflow-hidden">
        {isLoading && <Skeleton className="m-4 h-64" />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && (
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60">
                <TableHead>Measure</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="text-muted-foreground">{row.label}</TableCell>
                  <TableCell className="text-right font-medium">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </>
  );
}
