import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { fmt } from "../utils/dashboardHelpers";
import type { IApplicationByStatus } from "../store/dashboardApi";

interface Props {
  data: IApplicationByStatus[];
}

const STATUS_BAR_COLOR: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-red-500",
  3: "bg-green-500",
};

const STATUS_TEXT_COLOR: Record<number, string> = {
  1: "text-blue-600",
  2: "text-red-600",
  3: "text-green-600",
};

export function AppsByStatusCard({ data }: Props) {
  const { t } = useTranslation();
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          {t("dashboard.charts.appsByStatus")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((d) => {
            const pct = total > 0 ? (d.count / total) * 100 : 0;
            return (
              <div key={d.status}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span
                    className={`font-medium ${STATUS_TEXT_COLOR[d.status] ?? "text-foreground"}`}
                  >
                    {t(`dashboard.status.${d.statusLabel}`, {
                      defaultValue: d.statusLabel,
                    })}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {fmt(d.count)}{" "}
                    <span className="text-muted-foreground/60">
                      ({pct.toFixed(0)}%)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${STATUS_BAR_COLOR[d.status] ?? "bg-primary"} h-2 rounded-full transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">
            {t("dashboard.status.totalApplications", { val: fmt(total) })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
