import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@shared/ui/button";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { useGetLocalDrivingLicenseApplicationsQuery } from "../store/localDrivingLicenseApi";
import { useLocalDrivingLicenseColumns } from "./columns";
import { NewLocalLicenseDialog } from "./NewLocalLicenseDialog";
import type { ILocalDrivingLicenseApplicationView } from "../store/localDrivingLicenseApi";

export function LocalDrivingLicenseApplicationsTable() {
  const { t } = useTranslation();
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const { data: response, isLoading } =
    useGetLocalDrivingLicenseApplicationsQuery();

  const columns = useLocalDrivingLicenseColumns();
  const rows = response?.data ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("applications.localDrivingLicense.page.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("applications.localDrivingLicense.page.description")}
          </p>
        </div>
        <Button onClick={() => setNewDialogOpen(true)}>
          <Plus className="me-2 h-4 w-4" />
          {t("applications.localDrivingLicense.table.newApplication")}
        </Button>
      </div>

      {/* Table */}
      <DataTableV2WithContext<ILocalDrivingLicenseApplicationView>
        data={rows}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        labels={{
          search: t("applications.localDrivingLicense.table.search"),
          noResults: t("applications.localDrivingLicense.table.noResults"),
          rowsPerPage: t("applications.localDrivingLicense.table.rowsPerPage"),
          columns: t("applications.localDrivingLicense.table.columns"),
        }}
      />

      {/* New Application Dialog */}
      <NewLocalLicenseDialog
        open={newDialogOpen}
        onOpenChange={setNewDialogOpen}
      />
    </div>
  );
}
