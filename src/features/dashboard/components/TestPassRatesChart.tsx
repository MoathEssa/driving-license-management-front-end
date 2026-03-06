import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  CHART_COLORS,
  TOOLTIP_STYLE,
  TOOLTIP_WRAPPER_STYLE,
  useTickColor,
} from "../utils/dashboardHelpers";
import type { ITestPassRate } from "../store/dashboardApi";

interface Props {
  data: ITestPassRate[];
}

export function TestPassRatesChart({ data }: Props) {
  const { t } = useTranslation();
  const tickColor = useTickColor();
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          {t("dashboard.charts.testPassRates")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="testTypeTitle"
              tick={{ fontSize: 12, fill: tickColor }}
            />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              wrapperStyle={TOOLTIP_WRAPPER_STYLE}
              allowEscapeViewBox={{ x: true, y: true }}
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="passed"
              name={t("dashboard.legend.passed")}
              fill={CHART_COLORS.green}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="failed"
              name={t("dashboard.legend.failed")}
              fill={CHART_COLORS.red}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Pass rate badges */}
        <div className="mt-3 flex gap-4 flex-wrap border-t border-border pt-3">
          {data.map((d) => (
            <div
              key={d.testTypeTitle}
              className="flex items-baseline gap-1.5 text-xs"
            >
              <span className="text-muted-foreground">{d.testTypeTitle}:</span>
              <span
                className={`font-bold ${
                  d.passRatePct >= 70
                    ? "text-green-600"
                    : d.passRatePct >= 50
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {d.passRatePct.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
