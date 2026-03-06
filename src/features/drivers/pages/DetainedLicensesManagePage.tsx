import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, User, FileText, History, Unlock } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@shared/ui/badge";
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
import { useGetAllDetainedLicensesQuery } from "../store/detainedLicenseApi";
import type { IDetainedLicenseView } from "../store/detainedLicenseApi";
import { LicenseDetailsDialog, PersonHistoryDialog } from "@features/drivers";
import { ReleaseDetainedDialog } from "../components/ReleaseDetainedDialog";

type DialogState = {
  licenseDetails: number | null;
  history: { nationalNo: string; personName: string; driverId: number } | null;
  release: IDetainedLicenseView | null;
};

const INITIAL: DialogState = {
  licenseDetails: null,
  history: null,
  release: null,
};

export function DetainedLicensesManagePage() {
  const { t } = useTranslation();
  const [dialogs, setDialogs] = useState<DialogState>(INITIAL);

  const { data, isLoading } = useGetAllDetainedLicensesQuery();
  const rows = data?.data ?? [];

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const columns = useMemo<ColumnDef<IDetainedLicenseView>[]>(
    () => [
      {
        accessorKey: "detainId",
        header: t("drivers.manageDetained.col.detainId"),
        size: 80,
      },
      {
        accessorKey: "licenseId",
        header: t("drivers.manageDetained.col.licenseId"),
        size: 80,
      },
      {
        accessorKey: "driverId",
        header: t("drivers.manageDetained.col.driverId"),
        size: 80,
      },
      {
        accessorKey: "fullName",
        header: t("drivers.manageDetained.col.fullName"),
      },
      {
        accessorKey: "nationalNo",
        header: t("drivers.manageDetained.col.nationalNo"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "className",
        header: t("drivers.manageDetained.col.class"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "detainDate",
        header: t("drivers.manageDetained.col.detainDate"),
        cell: ({ getValue }) => fmt(getValue() as string),
      },
      {
        accessorKey: "fineFees",
        header: t("drivers.manageDetained.col.fineFees"),
        cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
      },
      {
        accessorKey: "isReleased",
        header: t("drivers.manageDetained.col.isReleased"),
        size: 100,
        cell: ({ getValue }) => {
          const released = getValue() as boolean;
          return (
            <Badge variant={released ? "secondary" : "destructive"}>
              {released
                ? t("drivers.manageDetained.released")
                : t("drivers.manageDetained.detained")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "releaseDate",
        header: t("drivers.manageDetained.col.releaseDate"),
        cell: ({ getValue }) => {
          const v = getValue() as string | null;
          return v ? fmt(v) : "—";
        },
      },
      {
        accessorKey: "releaseApplicationId",
        header: t("drivers.manageDetained.col.releaseAppId"),
        cell: ({ getValue }) => (getValue() as number | null) ?? "—",
      },
      {
        accessorKey: "createdByUsername",
        header: t("drivers.manageDetained.col.createdBy"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        id: "actions",
        header: t("drivers.manageDetained.col.actions"),
        size: 60,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{item.fullName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={!item.nationalNo}
                  onSelect={() => {
                    if (item.nationalNo)
                      setDialogs((d) => ({
                        ...d,
                        history: {
                          nationalNo: item.nationalNo!,
                          personName: item.fullName,
                          driverId: item.driverId,
                        },
                      }));
                  }}
                >
                  <User className="me-2 h-4 w-4" />
                  {t("drivers.manageDetained.actions.personDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    setDialogs((d) => ({
                      ...d,
                      licenseDetails: item.licenseApplicationId,
                    }))
                  }
                >
                  <FileText className="me-2 h-4 w-4" />
                  {t("drivers.manageDetained.actions.licenseDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!item.nationalNo}
                  onSelect={() => {
                    if (item.nationalNo)
                      setDialogs((d) => ({
                        ...d,
                        history: {
                          nationalNo: item.nationalNo!,
                          personName: item.fullName,
                          driverId: item.driverId,
                        },
                      }));
                  }}
                >
                  <History className="me-2 h-4 w-4" />
                  {t("drivers.manageDetained.actions.licenseHistory")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={item.isReleased}
                  className={
                    item.isReleased ? "" : "text-green-600 focus:text-green-600"
                  }
                  onSelect={() => {
                    if (!item.isReleased)
                      setDialogs((d) => ({ ...d, release: item }));
                  }}
                >
                  <Unlock className="me-2 h-4 w-4" />
                  {t("drivers.manageDetained.actions.release")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("drivers.manageDetained.pageTitle")}
        </h1>
        <p className="text-muted-foreground">
          {t("drivers.manageDetained.pageDescription")}
        </p>
      </div>

      {/* Table */}
      <DataTableV2WithContext<IDetainedLicenseView>
        data={rows}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        labels={{
          search: t("drivers.page.search"),
          noResults: t("drivers.page.noResults"),
          rowsPerPage: t("drivers.manageDetained.rowsPerPage"),
          columns: t("drivers.manageDetained.columns"),
        }}
      />

      {/* Dialogs */}
      {dialogs.licenseDetails !== null && (
        <LicenseDetailsDialog
          applicationId={dialogs.licenseDetails}
          open
          onOpenChange={(o) => {
            if (!o) setDialogs((d) => ({ ...d, licenseDetails: null }));
          }}
        />
      )}
      {dialogs.history && (
        <PersonHistoryDialog
          nationalNo={dialogs.history.nationalNo}
          personName={dialogs.history.personName}
          driverId={dialogs.history.driverId}
          open
          onOpenChange={(o) => {
            if (!o) setDialogs((d) => ({ ...d, history: null }));
          }}
        />
      )}
      {dialogs.release && (
        <ReleaseDetainedDialog
          detainedLicense={dialogs.release}
          open
          onOpenChange={(o) => {
            if (!o) setDialogs((d) => ({ ...d, release: null }));
          }}
        />
      )}
    </div>
  );
}
