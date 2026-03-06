import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, ListOrdered, History } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { useGetAllDriversQuery, type IDriver } from "../store/driverApi";
import { DriverLicensesDialog } from "../components/DriverLicensesDialog";
import { PersonHistoryDialog } from "../components/PersonHistoryDialog";

export function DriversPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetAllDriversQuery();
  const drivers = data?.data ?? [];

  const [licensesDialog, setLicensesDialog] = useState<{
    driverId: number;
    driverName: string;
  } | null>(null);
  const [historyDialog, setHistoryDialog] = useState<{
    nationalNo: string;
    personName: string;
    driverId: number;
  } | null>(null);

  const columns = useMemo<ColumnDef<IDriver>[]>(
    () => [
      {
        accessorKey: "driverId",
        header: t("drivers.page.col.id"),
        size: 70,
      },
      {
        accessorKey: "fullName",
        header: t("drivers.page.col.name"),
      },
      {
        accessorKey: "nationalNo",
        header: t("drivers.page.col.nationalNo"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "dateOfBirth",
        header: t("drivers.page.col.dob"),
        cell: ({ getValue }) => {
          const v = getValue() as string | null;
          return v ? new Date(v).toLocaleDateString() : "—";
        },
      },
      {
        accessorKey: "nationality",
        header: t("drivers.page.col.nationality"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "createdDate",
        header: t("drivers.page.col.createdDate"),
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString(),
      },
      {
        id: "actions",
        header: t("drivers.page.col.actions"),
        size: 60,
        cell: ({ row }) => {
          const driver = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{driver.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() =>
                    setLicensesDialog({
                      driverId: driver.driverId,
                      driverName: driver.fullName,
                    })
                  }
                >
                  <ListOrdered className="me-2 h-4 w-4" />
                  {t("drivers.page.actions.viewLicenses")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!driver.nationalNo}
                  onSelect={() => {
                    if (driver.nationalNo)
                      setHistoryDialog({
                        nationalNo: driver.nationalNo,
                        personName: driver.fullName,
                        driverId: driver.driverId,
                      });
                  }}
                >
                  <History className="me-2 h-4 w-4" />
                  {t("drivers.page.actions.licenseHistory")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [t],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("drivers.page.title")}
        </h1>
        <p className="text-muted-foreground">{t("drivers.page.description")}</p>
      </div>

      {/* Table */}
      <DataTableV2WithContext<IDriver>
        data={drivers}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        labels={{
          search: t("drivers.page.search"),
          noResults: t("drivers.page.noResults"),
          rowsPerPage: t("drivers.page.rowsPerPage"),
          columns: t("drivers.page.columns"),
        }}
      />

      {/* Dialogs */}
      {licensesDialog && (
        <DriverLicensesDialog
          driverId={licensesDialog.driverId}
          driverName={licensesDialog.driverName}
          open
          onOpenChange={(o) => {
            if (!o) setLicensesDialog(null);
          }}
        />
      )}
      {historyDialog && (
        <PersonHistoryDialog
          nationalNo={historyDialog.nationalNo}
          personName={historyDialog.personName}
          driverId={historyDialog.driverId}
          open
          onOpenChange={(o) => {
            if (!o) setHistoryDialog(null);
          }}
        />
      )}
    </div>
  );
}
