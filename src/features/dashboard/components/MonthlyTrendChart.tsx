import { useTranslation } from "react-i18next";
import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
import type { IMonthlyTrend } from "../store/dashboardApi";

interface Props {
  data: IMonthlyTrend[];
}

export function MonthlyTrendChart({ data }: Props) {
  const { t } = useTranslation();
  const tickColor = useTickColor();
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-500" />
          {t("dashboard.charts.monthlyTrend")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="yearMonth"
              tick={{ fontSize: 11, fill: tickColor }}
            />
            <YAxis tick={{ fontSize: 11, fill: tickColor }} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              wrapperStyle={TOOLTIP_WRAPPER_STYLE}
              allowEscapeViewBox={{ x: true, y: true }}
              cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="totalApplications"
              name={t("dashboard.legend.total")}
              stroke={CHART_COLORS.blue}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              name={t("dashboard.legend.completed")}
              stroke={CHART_COLORS.green}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
