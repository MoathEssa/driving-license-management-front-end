import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { fmt, fmtCurrency } from "../utils/dashboardHelpers";
import { Stat } from "./DashboardShared";
import type { IDetainStats } from "../store/dashboardApi";

interface Props {
  stats: IDetainStats;
}

export function DetainStatsCard({ stats }: Props) {
  const { t } = useTranslation();
  const releaseRate =
    stats.total > 0 ? (stats.released / stats.total) * 100 : 0;

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          {t("dashboard.detain.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Stat
            label={t("dashboard.detain.totalEver")}
            value={fmt(stats.total)}
          />
          <Stat
            label={t("dashboard.detain.totalFines")}
            value={fmtCurrency(stats.totalFines)}
          />
          <Stat
            label={t("dashboard.detain.currentlyDetained")}
            value={fmt(stats.currentlyDetained)}
            valueClass="text-red-600 font-bold"
          />
          <Stat
            label={t("dashboard.detain.pendingFines")}
            value={fmtCurrency(stats.pendingFines)}
            valueClass="text-amber-600"
          />
          <Stat
            label={t("dashboard.detain.released")}
            value={fmt(stats.released)}
            valueClass="text-green-600 font-bold"
          />
          <Stat
            label={t("dashboard.detain.collectedFines")}
            value={fmtCurrency(stats.collectedFines)}
            valueClass="text-green-600"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{t("dashboard.detain.releaseRate")}</span>
            <span className="font-medium text-foreground">
              {releaseRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(releaseRate, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
