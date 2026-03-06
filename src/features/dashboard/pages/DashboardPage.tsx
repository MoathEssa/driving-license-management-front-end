import { useTranslation } from "react-i18next";
import { useGetDashboardQuery } from "../store/dashboardApi";
import { KpiRow, KpiSkeleton } from "../components/KpiRow";
import { MonthlyTrendChart } from "../components/MonthlyTrendChart";
import { AppsByTypeChart } from "../components/AppsByTypeChart";
import { TestPassRatesChart } from "../components/TestPassRatesChart";
import { LicensesByReasonChart } from "../components/LicensesByReasonChart";
import { AppsByStatusCard } from "../components/AppsByStatusCard";
import { DetainStatsCard } from "../components/DetainStatsCard";
import { SystemStatsCard } from "../components/SystemStatsCard";
import { ChartSkeleton } from "../components/DashboardShared";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetDashboardQuery();

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive text-sm">
        Failed to load dashboard data.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.pageSubtitle")}
        </p>
      </div>

      {/* KPI row */}
      {isLoading || !data ? (
        <KpiSkeleton />
      ) : (
        <KpiRow kpis={data.kpis} />
      )}

      {/* Row 1: monthly trend + apps by type */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading || !data ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <MonthlyTrendChart data={data.monthlyTrend} />
            <AppsByTypeChart data={data.applicationsByType} />
          </>
        )}
      </div>

      {/* Row 2: test pass rates + licenses by reason */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {isLoading || !data ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <TestPassRatesChart data={data.testPassRates} />
            <LicensesByReasonChart data={data.licensesByIssueReason} />
          </>
        )}
      </div>

      {/* Row 3: apps by status + detain stats + system stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading || !data ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <AppsByStatusCard data={data.applicationsByStatus} />
            <DetainStatsCard stats={data.detainStats} />
            <SystemStatsCard kpis={data.kpis} />
          </>
        )}
      </div>
    </div>
  );
}
