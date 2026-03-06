import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { fmt } from "../utils/dashboardHelpers";
import type { IDashboardKpis } from "../store/dashboardApi";
import { Stat } from "./DashboardShared";

interface Props {
  kpis: IDashboardKpis;
}

export function SystemStatsCard({ kpis }: Props) {
  const { t } = useTranslation();
  const testPassRate =
    kpis.totalTestsTaken > 0
      ? ((kpis.totalTestsPassed / kpis.totalTestsTaken) * 100).toFixed(1)
      : "0";

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Users className="w-4 h-4 text-sky-500" />
          {t("dashboard.system.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Stat
            label={t("dashboard.system.totalPeople")}
            value={fmt(kpis.totalPeople)}
          />
          <Stat
            label={t("dashboard.system.testsTaken")}
            value={fmt(kpis.totalTestsTaken)}
          />
          <Stat
            label={t("dashboard.system.activeUsers")}
            value={fmt(kpis.totalActiveUsers)}
          />
          <Stat
            label={t("dashboard.system.testsPassed", { rate: testPassRate })}
            value={fmt(kpis.totalTestsPassed)}
            valueClass="text-green-600"
          />
          <Stat
            label={t("dashboard.system.intlActive")}
            value={fmt(kpis.totalActiveIntlLicenses)}
          />
          <Stat
            label={t("dashboard.system.expiredLicenses")}
            value={fmt(kpis.totalExpiredLicenses)}
            valueClass="text-amber-600"
          />
        </div>
      </CardContent>
    </Card>
  );
}
