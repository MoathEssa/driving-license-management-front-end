import { Skeleton } from "@shared/ui/skeleton";

export function ChartSkeleton() {
  return <Skeleton className="h-64 w-full rounded-lg" />;
}

interface StatProps {
  label: string;
  value: string;
  valueClass?: string;
}

export function Stat({ label, value, valueClass }: StatProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold mt-0.5 ${valueClass ?? ""}`}>
        {value}
      </p>
    </div>
  );
}
