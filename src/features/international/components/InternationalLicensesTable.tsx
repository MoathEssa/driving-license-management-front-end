import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@shared/ui/button";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { useGetAllInternationalLicensesQuery } from "../store/internationalLicenseApi";
import { useInternationalLicenseColumns } from "./columns";
import { IssueInternationalLicenseDialog } from "./IssueInternationalLicenseDialog";
import type { IInternationalLicenseView } from "../store/internationalLicenseApi";

export function InternationalLicensesTable() {
  const { t } = useTranslation();
  const [issueOpen, setIssueOpen] = useState(false);

  const { data, isLoading } = useGetAllInternationalLicensesQuery();
  const rows = data?.data ?? [];

  const { columns, dialogs } = useInternationalLicenseColumns();

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("international.managePage.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("international.managePage.description")}
          </p>
        </div>
        <Button onClick={() => setIssueOpen(true)}>
          <Plus className="me-2 h-4 w-4" />
          {t("international.issuePage.issueBtn")}
        </Button>
      </div>

      {/* Table */}
      <DataTableV2WithContext<IInternationalLicenseView>
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
          rowsPerPage: t("international.managePage.rowsPerPage"),
          columns: t("international.managePage.columns"),
        }}
      />

      {/* Issue dialog */}
      <IssueInternationalLicenseDialog
        open={issueOpen}
        onOpenChange={setIssueOpen}
      />

      {/* Row-action dialogs (managed inside the columns hook) */}
      {dialogs}
    </div>
  );
}
