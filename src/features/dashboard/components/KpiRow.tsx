import { useTranslation } from "react-i18next";
import { Car, CreditCard, FileText, Lock, DollarSign } from "lucide-react";
import { Card, CardContent } from "@shared/ui/card";
import { Skeleton } from "@shared/ui/skeleton";
import type { IDashboardKpis } from "../store/dashboardApi";
import { fmt, fmtCurrency } from "../utils/dashboardHelpers";

interface KpiCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function KpiCard({ title, value, sub, icon, iconBg }: KpiCardProps) {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground leading-tight">
              {value}
            </p>
            {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
          </div>
          <div
            className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${iconBg}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiSkeleton() {
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Skeleton className="h-3 w-24 mb-2" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
          <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiRow({ kpis }: { kpis: IDashboardKpis }) {
  const { t } = useTranslation();
  const cards: KpiCardProps[] = [
    {
      title: t("dashboard.kpi.licensedDrivers"),
      value: fmt(kpis.totalDrivers),
      sub: t("dashboard.kpi.peopleRegistered", {
        val: fmt(kpis.totalPeople),
      }),
      icon: <Car className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: t("dashboard.kpi.activeLicenses"),
      value: fmt(kpis.totalActiveLicenses),
      sub: t("dashboard.kpi.internationalCount", {
        val: fmt(kpis.totalActiveIntlLicenses),
      }),
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: t("dashboard.kpi.applicationsMonth"),
      value: fmt(kpis.applicationsThisMonth),
      sub: t("dashboard.kpi.allTime", { val: fmt(kpis.totalApplications) }),
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: t("dashboard.kpi.detainedLicenses"),
      value: fmt(kpis.currentlyDetained),
      sub: t("dashboard.kpi.totalFines", {
        amount: fmtCurrency(kpis.totalFineFeesCollected),
      }),
      icon: <Lock className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: t("dashboard.kpi.revenueMonth"),
      value: fmtCurrency(kpis.feesCollectedThisMonth),
      sub: t("dashboard.kpi.allTime", {
        val: fmtCurrency(kpis.totalFeesCollected),
      }),
      icon: <DollarSign className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => (
        <KpiCard key={c.title} {...c} />
      ))}
    </div>
  );
}
