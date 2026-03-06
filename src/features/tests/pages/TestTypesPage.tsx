import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { useTestTypesColumns } from "../testTypes/components/columns";
import { EditTestTypeDialog } from "../testTypes/components/EditTestTypeDialog";
import { useGetAllTestTypesQuery, type ITestType } from "../store/testTypesApi";

export function TestTypesPage() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllTestTypesQuery();

  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<ITestType | null>(null);

  const handleEdit = (row: ITestType) => {
    setSelected(row);
    setEditOpen(true);
  };

  const columns = useTestTypesColumns(handleEdit);
  const rows = response?.data ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {t("tests.testTypes.page.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("tests.testTypes.page.description")}
        </p>
      </div>

      <DataTableV2WithContext<ITestType>
        data={rows}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        labels={{
          search: t("tests.testTypes.table.search"),
          noResults: t("tests.testTypes.table.noResults"),
          rowsPerPage: t("tests.testTypes.table.rowsPerPage"),
          columns: t("tests.testTypes.table.columns"),
        }}
      />

      <EditTestTypeDialog
        testType={selected}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
