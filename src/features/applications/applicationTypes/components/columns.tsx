import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ColumnHeader } from "@shared/components/data-table-v2/ui/ColumnHeader";
import { Button } from "@shared/ui/button";
import { Pencil } from "lucide-react";
import type { IApplicationType } from "../../store/applicationTypesApi";

export function useApplicationTypesColumns(
  onEdit?: (row: IApplicationType) => void,
): ColumnDef<IApplicationType, unknown>[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "applicationTypeId",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.applicationTypes.columns.id")}
          />
        ),
        size: 60,
        enableSorting: true,
      },
      {
        accessorKey: "applicationTypeTitle",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.applicationTypes.columns.title")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.getValue<string>("applicationTypeTitle")}
          </span>
        ),
      },
      {
        accessorKey: "applicationFees",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("applications.applicationTypes.columns.fees")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.getValue<number>("applicationFees").toFixed(4)}</span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        size: 60,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(row.original)}
                className="h-7 w-7 p-0"
                title={t("applications.applicationTypes.actions.edit")}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [t, onEdit],
  );
}
