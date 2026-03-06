import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@shared/ui/button";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { usePeopleColumns } from "../components/columns";
import { AddPersonDialog } from "../components/AddPersonDialog";
import { EditPersonDialog } from "../components/EditPersonDialog";
import { DeletePersonDialog } from "../components/DeletePersonDialog";
import { useGetAllPersonsQuery, type IPerson } from "../store/peopleApi";

export function PeoplePage() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllPersonsQuery();

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<IPerson | null>(null);

  const handleEdit = (person: IPerson) => {
    setSelectedPerson(person);
    setEditOpen(true);
  };

  const handleDelete = (person: IPerson) => {
    setSelectedPerson(person);
    setDeleteOpen(true);
  };

  const columns = usePeopleColumns(handleEdit, handleDelete);
  const people = response?.data ?? [];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("people.page.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("people.page.description")}
          </p>
        </div>
      </div>

      <DataTableV2WithContext<IPerson>
        data={people}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        toolbarContent={
          <Button onClick={() => setAddOpen(true)} size="sm" className="h-8">
            <Plus className="h-4 w-4 me-1" />
            {t("people.addPerson.button")}
          </Button>
        }
        labels={{
          search: t("people.table.search"),
          noResults: t("people.table.noResults"),
          rowsPerPage: t("people.table.rowsPerPage"),
          columns: t("people.table.columns"),
        }}
      />

      <AddPersonDialog open={addOpen} onOpenChange={setAddOpen} />

      <EditPersonDialog
        person={selectedPerson}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setSelectedPerson(null);
        }}
      />

      <DeletePersonDialog
        person={selectedPerson}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedPerson(null);
        }}
      />
    </div>
  );
}
