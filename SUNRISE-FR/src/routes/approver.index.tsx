import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";

import { approvalApi } from "@/api/approvalApi";
import { getApiErrorMessage } from "@/api/axiosClient";
import { EmptyState, ErrorState, RowSkeleton } from "@/components/common/states";
import { BookingsTable } from "@/components/bookings/BookingsTable";
import { PageHeader } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/approver/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Approver Dashboard — Sunrise Travel" },
      {
        name: "description",
        content: "Overview of travel requests awaiting your approval, with amounts and destinations.",
      },
      { property: "og:title", content: "Approver Dashboard — Sunrise Travel" },
      { property: "og:description", content: "Travel approvals overview for managers." },
    ],
  }),
  component: ApproverDashboard,
});

function ApproverDashboard() {
  const navigate = useNavigate();
  const { session } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["approvals", "pending"],
    queryFn: approvalApi.pending,
  });

  const pending = data ?? [];
  const totalValue = pending.reduce((sum, booking) => sum + (booking.amount ?? 0), 0);
  const flights = pending.filter((b) => String(b.bookingType).toUpperCase() === "FLIGHT").length;

  return (
    <>
      <PageHeader
        title={`Approvals overview`}
        description={`Signed in as ${session?.email ?? "approver"}. Review requests before travel dates approach.`}
        action={
          <Button onClick={() => navigate({ to: "/approver/pending" })}>
            <ClipboardList className="mr-2 size-4" /> Review pending
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card label="Pending requests" value={isLoading ? "—" : String(pending.length)} />
        <Card label="Flight requests" value={isLoading ? "—" : String(flights)} />
        <Card label="Value awaiting decision" value={isLoading ? "—" : formatCurrency(totalValue)} />
      </div>

      <section className="panel mt-6 overflow-hidden">
        <header className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Oldest pending requests</h2>
        </header>
        {isLoading && <RowSkeleton rows={3} />}
        {!isLoading && isError && (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        )}
        {!isLoading && !isError && pending.length === 0 && (
          <EmptyState title="No pending approvals" description="You are all caught up." />
        )}
        {!isLoading && !isError && pending.length > 0 && (
          <BookingsTable bookings={pending.slice(0, 5)} showTraveler />
        )}
      </section>
    </>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
