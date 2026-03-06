import { useState } from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, User, FileText, History } from "lucide-react";
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
import { LicenseDetailsDialog, PersonHistoryDialog } from "@features/drivers";
import type { IInternationalLicenseView } from "../store/internationalLicenseApi";

type DialogState = {
  licenseDetails: number | null;
  history: { nationalNo: string; personName: string } | null;
};

const INITIAL: DialogState = { licenseDetails: null, history: null };

export function useInternationalLicenseColumns() {
  const { t } = useTranslation();
  const [dialogs, setDialogs] = useState<DialogState>(INITIAL);

  const columns = useMemo<ColumnDef<IInternationalLicenseView>[]>(
    () => [
      {
        accessorKey: "internationalLicenseId",
        header: t("international.managePage.col.intLicenseId"),
        size: 80,
      },
      {
        accessorKey: "applicationId",
        header: t("international.managePage.col.applicationId"),
        size: 80,
      },
      {
        accessorKey: "localLicenseId",
        header: t("international.managePage.col.localLicenseId"),
        size: 90,
      },
      {
        accessorKey: "driverId",
        header: t("international.managePage.col.driverId"),
        size: 80,
      },
      {
        accessorKey: "fullName",
        header: t("international.managePage.col.fullName"),
      },
      {
        accessorKey: "nationalNo",
        header: t("international.managePage.col.nationalNo"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "localLicenseClass",
        header: t("international.managePage.col.localClass"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        accessorKey: "issueDate",
        header: t("international.managePage.col.issueDate"),
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: "expirationDate",
        header: t("international.managePage.col.expiryDate"),
        cell: ({ getValue }) =>
          new Date(getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: "isActive",
        header: t("international.managePage.col.isActive"),
        size: 80,
        cell: ({ getValue }) => {
          const active = getValue() as boolean;
          return (
            <Badge variant={active ? "default" : "secondary"}>
              {active
                ? t("international.managePage.yes")
                : t("international.managePage.no")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "paidFees",
        header: t("international.managePage.col.paidFees"),
        cell: ({ getValue }) => `${(getValue() as number).toFixed(2)}`,
      },
      {
        accessorKey: "createdByUsername",
        header: t("international.managePage.col.issuedBy"),
        cell: ({ getValue }) => (getValue() as string | null) ?? "—",
      },
      {
        id: "actions",
        header: t("international.managePage.col.actions"),
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
              <DropdownMenuContent align="end" className="w-52">
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
                        },
                      }));
                  }}
                >
                  <User className="me-2 h-4 w-4" />
                  {t("international.managePage.actions.personDetails")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() =>
                    setDialogs((d) => ({
                      ...d,
                      licenseDetails: item.localApplicationId,
                    }))
                  }
                >
                  <FileText className="me-2 h-4 w-4" />
                  {t("international.managePage.actions.licenseDetails")}
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
                        },
                      }));
                  }}
                >
                  <History className="me-2 h-4 w-4" />
                  {t("international.managePage.actions.licenseHistory")}
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

  const dialogs$ = (
    <>
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
          open
          onOpenChange={(o) => {
            if (!o) setDialogs((d) => ({ ...d, history: null }));
          }}
        />
      )}
    </>
  );

  return { columns, dialogs: dialogs$ };
}
