import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ColumnHeader } from "@shared/components/data-table-v2/ui/ColumnHeader";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@shared/ui/tooltip";
import { Mail, UserCheck, UserX } from "lucide-react";
import type { IUser } from "../store/usersApi";

export function useUsersColumns(
  currentUserId: number | undefined,
  onSendEmail?: (user: IUser) => void,
  onToggleActive?: (user: IUser) => void,
): ColumnDef<IUser, unknown>[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "userId",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.userId")} />
        ),
        size: 60,
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.email")} />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue<string>("email") ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.role")} />
        ),
        enableSorting: true,
        cell: ({ row }) => {
          const roleStr = row.getValue<string>("role") ?? "User";
          const roles = roleStr
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean);
          return (
            <div className="flex flex-wrap gap-1">
              {roles.map((r) => (
                <Badge
                  key={r}
                  variant={r === "Admin" ? "default" : "secondary"}
                >
                  {t(`users.roles.${r.toLowerCase()}`, { defaultValue: r })}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.fullName")} />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.getValue<string | undefined>("fullName") ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "phoneNumber",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.phone")} />
        ),
        cell: ({ row }) => {
          const phone = row.getValue<string | undefined>("phoneNumber");
          return phone ? (
            <span>{phone}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.status")} />
        ),
        enableSorting: true,
        cell: ({ row }) => {
          const isActive = row.getValue<boolean>("isActive");
          return (
            <Badge variant={isActive ? "default" : "outline"}>
              {t(isActive ? "users.status.active" : "users.status.inactive")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("users.columns.createdAt")} />
        ),
        enableSorting: true,
        cell: ({ row }) => {
          const createdAt = row.getValue<string | undefined>("createdAt");
          return createdAt ? (
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        size: 100,
        cell: ({ row }) => {
          const user = row.original;
          const isSelf = user.userId === currentUserId;

          return (
            <TooltipProvider>
              <div className="flex items-center gap-1">
                {/* Send Email */}
                {onSendEmail && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSendEmail(user)}
                        className="h-7 w-7 p-0"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t("users.actions.sendEmail")}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* Toggle Active */}
                {onToggleActive && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {/* Wrap in span so tooltip still shows when button is disabled */}
                      <span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleActive(user)}
                          disabled={isSelf && user.isActive}
                          className={
                            user.isActive
                              ? "h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              : "h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          }
                        >
                          {user.isActive ? (
                            <UserX className="h-3.5 w-3.5" />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isSelf && user.isActive
                        ? t("users.actions.cannotDeactivateSelf")
                        : user.isActive
                          ? t("users.actions.deactivate")
                          : t("users.actions.activate")}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          );
        },
      },
    ],
    [t, currentUserId, onSendEmail, onToggleActive],
  );
}
