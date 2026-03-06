import { useTranslation } from "react-i18next";
import {
  User,
  Mail,
  Hash,
  ShieldCheck,
  CircleCheck,
  CircleX,
  CalendarDays,
  Clock,
} from "lucide-react";
import { useAppSelector } from "@app/store";
import { useGetMyProfileQuery } from "../store/accountApi";
import { Avatar, AvatarFallback } from "@shared/ui/avatar";
import { Badge } from "@shared/ui/badge";
import { Skeleton } from "@shared/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";

// ── Helpers ───────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <div className="mt-0.5 text-sm font-medium break-all">{value}</div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-start gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-md shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Page ─────────────────────────────────────────────────────────────────

export function AccountSettingsPage() {
  const { t } = useTranslation();
  const authData = useAppSelector((s) => s.auth.authData);
  const { data: response, isLoading } = useGetMyProfileQuery();

  const user = authData?.user;
  const profile = response?.data;

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col gap-6 p-4 ">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("auth.accountSettings.pageTitle")}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("auth.accountSettings.pageDescription")}
        </p>
      </div>

      {/* Profile banner */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="h-16 w-16 rounded-xl text-lg font-bold">
            <AvatarFallback className="rounded-xl text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xl font-semibold truncate">
              {user?.fullName ?? "—"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email ?? "—"}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {isLoading ? (
                <Skeleton className="h-5 w-16 rounded-full" />
              ) : (
                (profile?.roles ?? user?.roles ?? []).map((role) => (
                  <Badge
                    key={role}
                    variant="secondary"
                    className="text-xs capitalize"
                  >
                    {role}
                  </Badge>
                ))
              )}
            </div>
          </div>
          {!isLoading && profile && (
            <div className="ms-auto shrink-0">
              {profile.isActive ? (
                <Badge className="gap-1 bg-green-100 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:text-green-400 dark:border-green-800">
                  <CircleCheck className="h-3.5 w-3.5" />
                  {t("auth.accountSettings.active")}
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <CircleX className="h-3.5 w-3.5" />
                  {t("auth.accountSettings.inactive")}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* User information */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              {t("auth.accountSettings.userInfoTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <>
                <SkeletonRow />
                <Separator />
                <SkeletonRow />
                <Separator />
                <SkeletonRow />
                <Separator />
                <SkeletonRow />
              </>
            ) : (
              <>
                <InfoRow
                  icon={Hash}
                  label={t("auth.accountSettings.userId")}
                  value={
                    <span className="font-mono">
                      #{profile?.userId ?? user?.userId ?? "—"}
                    </span>
                  }
                />
                <Separator />
                <InfoRow
                  icon={User}
                  label={t("auth.accountSettings.fullName")}
                  value={profile?.fullName ?? user?.fullName ?? "—"}
                />
                <Separator />
                <InfoRow
                  icon={Mail}
                  label={t("auth.accountSettings.email")}
                  value={profile?.email ?? user?.email ?? "—"}
                />
                <Separator />
                <InfoRow
                  icon={ShieldCheck}
                  label={t("auth.accountSettings.roles")}
                  value={
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {(profile?.roles ?? user?.roles ?? []).map((r) => (
                        <Badge
                          key={r}
                          variant="outline"
                          className="text-xs capitalize"
                        >
                          {r}
                        </Badge>
                      ))}
                    </div>
                  }
                />
              </>
            )}
          </CardContent>
        </Card>

        {/* Activity / Account details */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {t("auth.accountSettings.activityTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <>
                <SkeletonRow />
                <Separator />
                <SkeletonRow />
                <Separator />
                <SkeletonRow />
              </>
            ) : (
              <>
                <InfoRow
                  icon={CircleCheck}
                  label={t("auth.accountSettings.accountStatus")}
                  value={
                    profile?.isActive ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {t("auth.accountSettings.active")}
                      </span>
                    ) : (
                      <span className="text-destructive font-medium">
                        {t("auth.accountSettings.inactive")}
                      </span>
                    )
                  }
                />
                <Separator />
                <InfoRow
                  icon={CalendarDays}
                  label={t("auth.accountSettings.createdAt")}
                  value={formatDate(profile?.createdAt)}
                />
                <Separator />
                <InfoRow
                  icon={Clock}
                  label={t("auth.accountSettings.lastLogin")}
                  value={
                    profile?.lastLoginAt
                      ? formatDate(profile.lastLoginAt)
                      : t("auth.accountSettings.never")
                  }
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
