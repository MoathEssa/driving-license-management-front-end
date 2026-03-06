import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  fmt,
  PIE_PALETTE,
  TOOLTIP_STYLE,
  TOOLTIP_WRAPPER_STYLE,
} from "../utils/dashboardHelpers";
import type { ILicenseByIssueReason } from "../store/dashboardApi";

interface Props {
  data: ILicenseByIssueReason[];
}

export function LicensesByReasonChart({ data }: Props) {
  const { t } = useTranslation();
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-cyan-500" />
          {t("dashboard.charts.licensesByReason")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="issueReasonLabel"
                  cx="50%"
                  cy="50%"
                  outerRadius={82}
                  innerRadius={46}
                  paddingAngle={2}
                >
                  {data.map((_, i) => (
                    <Cell
                      key={i}
                      fill={PIE_PALETTE[i % PIE_PALETTE.length]}
                      strokeWidth={0}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  wrapperStyle={TOOLTIP_WRAPPER_STYLE}
                  allowEscapeViewBox={{ x: true, y: true }}
                  formatter={(value) => [
                    fmt(Number(value)),
                    t("dashboard.legend.licenses"),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2.5 flex-1 min-w-0">
            {data.map((d, i) => (
              <div
                key={d.issueReasonLabel}
                className="flex items-center gap-2.5 min-w-0"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: PIE_PALETTE[i % PIE_PALETTE.length] }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-medium text-foreground truncate">
                      {d.issueReasonLabel}
                    </p>
                    <span className="text-xs font-semibold text-foreground shrink-0">
                      {fmt(d.count)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1 mt-1">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: `${total > 0 ? (d.count / total) * 100 : 0}%`,
                        background: PIE_PALETTE[i % PIE_PALETTE.length],
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
