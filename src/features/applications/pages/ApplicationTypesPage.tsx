import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { useApplicationTypesColumns } from "../applicationTypes/components/columns";
import { EditApplicationTypeDialog } from "../applicationTypes/components/EditApplicationTypeDialog";
import {
  useGetAllApplicationTypesQuery,
  type IApplicationType,
} from "../store/applicationTypesApi";

export function ApplicationTypesPage() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllApplicationTypesQuery();

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<IApplicationType | null>(null);

  const handleEdit = (row: IApplicationType) => {
    setSelected(row);
    setEditOpen(true);
  };

  const columns = useApplicationTypesColumns(handleEdit);
  const rows = response?.data ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("applications.applicationTypes.page.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("applications.applicationTypes.page.description")}
        </p>
      </div>

      <DataTableV2WithContext<IApplicationType>
        data={rows}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        labels={{
          search: t("applications.applicationTypes.table.search"),
          noResults: t("applications.applicationTypes.table.noResults"),
          rowsPerPage: t("applications.applicationTypes.table.rowsPerPage"),
          columns: t("applications.applicationTypes.table.columns"),
        }}
      />

      <EditApplicationTypeDialog
        applicationType={selected}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
