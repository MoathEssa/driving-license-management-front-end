import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { ColumnHeader } from "@shared/components/data-table-v2/ui/ColumnHeader";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Gender, getGenderI18nKey } from "@shared/types";
import type { IPerson } from "../store/peopleApi";

export function usePeopleColumns(
  onEdit: (person: IPerson) => void,
  onDelete: (person: IPerson) => void,
): ColumnDef<IPerson, unknown>[] {
  const { t } = useTranslation();

  return useMemo(
    () => [
      {
        accessorKey: "personId",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("people.columns.id")} />
        ),
        size: 60,
        enableSorting: true,
      },
      {
        accessorKey: "nationalNo",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("people.columns.nationalNo")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-mono text-sm">
            {row.getValue<string | null>("nationalNo") ?? "—"}
          </span>
        ),
      },
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("people.columns.fullName")} />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <span className="font-medium">
            {row.getValue<string>("fullName")}
          </span>
        ),
      },
      {
        accessorKey: "gender",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("people.columns.gender")} />
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const gender = row.getValue<number | null>("gender");
          if (gender === null || gender === undefined)
            return <span className="text-muted-foreground">—</span>;
          const key = getGenderI18nKey(
            gender as typeof Gender.Male | typeof Gender.Female,
          );
          return (
            <Badge variant={gender === Gender.Male ? "default" : "secondary"}>
              {t(key)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "dateOfBirth",
        header: ({ column }) => (
          <ColumnHeader
            column={column}
            title={t("people.columns.dateOfBirth")}
          />
        ),
        enableSorting: true,
        cell: ({ row }) => {
          const dob = row.getValue<string | null>("dateOfBirth");
          return dob ? (
            <span>{new Date(dob).toLocaleDateString()}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("people.columns.email")} />
        ),
        cell: ({ row }) => {
          const email = row.getValue<string | null>("email");
          return email ? (
            <span className="text-sm">{email}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "phone",
        header: ({ column }) => (
          <ColumnHeader column={column} title={t("people.columns.phone")} />
        ),
        cell: ({ row }) => {
          const phone = row.getValue<string | null>("phone");
          return phone ? (
            <span>{phone}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        size: 120,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row.original)}
              className="h-7 w-7 p-0"
              title={t("people.actions.edit")}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.original)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              title={t("people.actions.delete")}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [t, onEdit, onDelete],
  );
}
