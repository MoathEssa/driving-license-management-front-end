import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
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
import type { IApplicationByType } from "../store/dashboardApi";

interface Props {
  data: IApplicationByType[];
}

export function AppsByTypeChart({ data }: Props) {
  const { t } = useTranslation();
  const tickColor = useTickColor();
  const typeMap: Record<string, string> = {
    "New Local Driving License": t("dashboard.appTypeShort.newLocal"),
    "New International License": t("dashboard.appTypeShort.international"),
    "Renew Driving License": t("dashboard.appTypeShort.renewal"),
    "Replacement for Lost/Damaged": t("dashboard.appTypeShort.replacement"),
    "Replacement for Lost": t("dashboard.appTypeShort.replacement"),
    "Release Detained Driving License": t("dashboard.appTypeShort.release"),
    "Driving Test": t("dashboard.appTypeShort.drivingTest"),
    "Retake Test": t("dashboard.appTypeShort.retakeTest"),
  };
  const shortened = data.map((d) => ({
    ...d,
    name: typeMap[d.applicationTypeTitle] ?? d.applicationTypeTitle,
  }));

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-500" />
          {t("dashboard.charts.appsByType")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={shortened}
            margin={{ top: 4, right: 16, left: -10, bottom: 36 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: tickColor }}
              angle={-30}
              textAnchor="end"
              interval={0}
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
              dataKey="total"
              name={t("dashboard.legend.total")}
              fill={CHART_COLORS.purple}
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name={t("dashboard.legend.completed")}
              fill={CHART_COLORS.green}
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
