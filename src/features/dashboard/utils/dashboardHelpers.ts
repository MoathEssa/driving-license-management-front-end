// Shared formatting helpers and constants for dashboard components
import { useEffect, useState } from "react";

export const fmt = (n: number) =>
  Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);

export const fmtCurrency = (n: number) =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const CHART_COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  orange: "#f97316",
  indigo: "#6366f1",
} as const;

export const PIE_PALETTE = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.amber,
];

// Shared tooltip style — prevents the "muddy" overlap issue by giving the
// tooltip a high z-index and a solid card background.
export const TOOLTIP_STYLE: React.CSSProperties = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
};

export const TOOLTIP_WRAPPER_STYLE: React.CSSProperties = {
  zIndex: 50,
  outline: "none",
};

/**
 * Returns a tick fill color that works in both light and dark mode.
 * Recharts passes `fill` as an SVG attribute (not CSS style), so
 * CSS custom properties (hsl(var(--x))) don't resolve there.
 * This hook reads the real computed value reactively.
 */
export function useTickColor(): string {
  const isDark = () => document.documentElement.classList.contains("dark");
  const [dark, setDark] = useState(isDark);

  useEffect(() => {
    const observer = new MutationObserver(() => setDark(isDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // gray-400 in dark, gray-500 in light — readable on both backgrounds
  return dark ? "#9ca3af" : "#6b7280";
}
