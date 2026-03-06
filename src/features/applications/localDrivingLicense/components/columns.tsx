import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ColumnHeader } from "@shared/components/data-table-v2/ui/ColumnHeader";
import { Badge } from "@shared/ui/badge";
import type { ILocalDrivingLicenseApplicationView } from "../store/localDrivingLicenseApi";
import { ActionsCell } from "./ActionsCell";

const STATUS_VARIANT = {
  1: "default", // New
  2: "destructive", // Cancelled
  3: "secondary", // Completed
} as const;

export function useLocalDrivingLicenseColumns(): ColumnDef<
  ILocalDrivingLicenseApplicationView,
  unknown
>[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "applicationId",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.applicationId")}
          />
        ),
        size: 80,
        enableSorting: true,
      },
      {
        accessorKey: "drivingClass",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.drivingClass")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.getValue<string>("drivingClass")}
          </span>
        ),
      },
      {
        accessorKey: "nationalNo",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.nationalNo")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => row.getValue<string | null>("nationalNo") ?? "—",
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.fullName")}
          />
        ),
        enableSorting: true,
      },
      {
        accessorKey: "passedTests",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.passedTests")}
          />
        ),
        enableSorting: true,
        size: 100,
        cell: ({ row }) => (
          <span className="font-mono">
            {row.getValue<number>("passedTests")}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.status")}
          />
        ),
        enableSorting: true,
        size: 110,
        cell: ({ row }) => {
          const status = row.getValue<1 | 2 | 3>("status");
          return (
            <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
              {t(`applications.localDrivingLicense.status.${status}`)}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.localDrivingLicense.columns.actions")}
          />
        ),
        enableSorting: false,
        size: 56,
        cell: ({ row }) => <ActionsCell row={row} />,
      },
    ],
    [t],
  );
}
