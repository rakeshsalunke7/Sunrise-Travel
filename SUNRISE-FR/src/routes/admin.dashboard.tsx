import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";

import { getApiErrorMessage } from "@/api/axiosClient";
import { dashboardApi } from "@/api/dashboardApi";
import { ErrorState } from "@/components/common/states";
import { PageHeader } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Sunrise Travel" },
      {
        name: "description",
        content:
          "Corporate travel desk overview: booking volumes, approval pipeline, travel spend and top destination.",
      },
      { property: "og:title", content: "Admin Dashboard — Sunrise Travel" },
      {
        property: "og:description",
        content: "Booking volumes, approvals and travel spend.",
      },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.summary,
  });

  if (isError) {
    return (
      <>
        <PageHeader title="Travel desk dashboard" />

        <div className="panel">
          <ErrorState
            message={getApiErrorMessage(error)}
            onRetry={() => refetch()}
          />
        </div>
      </>
    );
  }

  const statusBreakdown = data
    ? [
        {
          label: "Pending",
          value: data.pendingBookings,
          color: "bg-warning",
        },
        {
          label: "Approved",
          value: data.approvedBookings,
          color: "bg-success",
        },
        {
          label: "Ticketed",
          value: data.ticketedBookings,
          color: "bg-primary",
        },
        {
          label: "Rejected",
          value: data.rejectedBookings,
          color: "bg-destructive",
        },
        {
          label: "Cancelled",
          value: data.cancelledBookings,
          color: "bg-muted-foreground",
        },
      ]
    : [];

  const breakdownTotal = statusBreakdown.reduce(
    (sum, item) => sum + (item.value ?? 0),
    0,
  );

  const metrics = [
    {
      label: "Total bookings",
      value: data?.totalBookings,
      icon: BriefcaseBusiness,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Today's bookings",
      value: data?.todayBookings,
      icon: CalendarDays,
      iconClass: "bg-info-muted text-info-foreground",
    },
    {
      label: "Pending approvals",
      value: data?.pendingBookings,
      icon: Clock3,
      iconClass: "bg-warning-muted text-warning-foreground",
    },
    {
      label: "Approved bookings",
      value: data?.approvedBookings,
      icon: CheckCircle2,
      iconClass: "bg-success-muted text-success-foreground",
    },
    {
      label: "Ticketed bookings",
      value: data?.ticketedBookings,
      icon: Ticket,
      iconClass: "bg-primary/10 text-primary",
    },
    {
      label: "Cancelled bookings",
      value: data?.cancelledBookings,
      icon: XCircle,
      iconClass: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <>
      <PageHeader
        title="Travel desk dashboard"
        description="Live figures reported by the corporate travel service."
      />

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="panel group p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-raised"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {metric.label}
                  </p>

                  {isLoading ? (
                    <Skeleton className="mt-3 h-8 w-16" />
                  ) : (
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                      {metric.value ?? 0}
                    </p>
                  )}
                </div>

                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${metric.iconClass}`}
                >
                  <Icon className="size-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower dashboard */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Status breakdown */}
        <div className="panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Booking status
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Current distribution of travel requests.
              </p>
            </div>

            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              {breakdownTotal} total
            </span>
          </div>

          {isLoading ? (
            <Skeleton className="mt-6 h-24 w-full" />
          ) : breakdownTotal === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">
              No bookings have been recorded yet.
            </p>
          ) : (
            <div className="mt-6 space-y-5">
              {/* Progress bar */}
              <div className="flex h-3 overflow-hidden rounded-full bg-muted">
                {statusBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className={item.color}
                    style={{
                      width: `${((item.value ?? 0) / breakdownTotal) * 100}%`,
                    }}
                  />
                ))}
              </div>

              {/* Status list */}
              <ul className="grid gap-3 sm:grid-cols-2">
                {statusBreakdown.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className={`size-2.5 rounded-full ${item.color}`}
                      />

                      {item.label}
                    </span>

                    <span className="font-semibold text-foreground">
                      {item.value ?? 0}

                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        (
                        {Math.round(
                          ((item.value ?? 0) / breakdownTotal) * 100,
                        )}
                        %)
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Travel insights */}
        <div className="space-y-5">
          <div className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Total travel spend
                </p>

                {isLoading ? (
                  <Skeleton className="mt-3 h-8 w-28" />
                ) : (
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {formatCurrency(data?.totalTravelSpend)}
                  </p>
                )}
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-success-muted text-success-foreground">
                <BriefcaseBusiness className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Total value of recorded corporate travel bookings.
            </p>
          </div>

          <div className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Most travelled city
                </p>

                {isLoading ? (
                  <Skeleton className="mt-3 h-8 w-32" />
                ) : (
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    {data?.mostTravelledCity || "Not available"}
                  </p>
                )}
              </div>

              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Destination with the highest number of recorded trips.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}