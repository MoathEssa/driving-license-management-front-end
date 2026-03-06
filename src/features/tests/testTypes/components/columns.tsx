import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ColumnHeader } from "@shared/components/data-table-v2/ui/ColumnHeader";
import { Button } from "@shared/ui/button";
import { Pencil } from "lucide-react";
import type { ITestType } from "../../store/testTypesApi";

export function useTestTypesColumns(
  onEdit?: (row: ITestType) => void,
): ColumnDef<ITestType, unknown>[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "testTypeId",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("tests.testTypes.columns.id")}
          />
        ),
        size: 60,
        enableSorting: true,
      },
      {
        accessorKey: "testTypeTitle",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("tests.testTypes.columns.title")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.getValue<string>("testTypeTitle")}
          </span>
        ),
      },
      {
        accessorKey: "testTypeDescription",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("tests.testTypes.columns.description")}
          />
        ),
        cell: ({ row }) => {
          const desc = row.getValue<string | null>("testTypeDescription");
          return desc ? (
            <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
              {desc}
            </span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "testTypeFees",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("tests.testTypes.columns.fees")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span>{row.getValue<number>("testTypeFees").toFixed(4)}</span>
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
                title={t("tests.testTypes.actions.edit")}
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
