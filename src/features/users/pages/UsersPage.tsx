import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/alert-dialog";
import { DataTableV2WithContext } from "@shared/components/data-table-v2/DataTableV2WithContext";
import { useAppSelector } from "@app/store";
import { useUsersColumns } from "../components/columns";
import { AddUserWizard } from "../components/AddUserWizard";
import { SendEmailDialog } from "../components/SendEmailDialog";
import {
  useGetAllUsersQuery,
  useSetUserActiveMutation,
  type IUser,
} from "../store/usersApi";

export function UsersPage() {
  const { t } = useTranslation();
  const { data: response, isLoading } = useGetAllUsersQuery();
  const [setUserActive] = useSetUserActiveMutation();

  // Current logged-in admin's ID (used to disable self-deactivation)
  const currentUserId = useAppSelector((s) => s.auth.authData?.user.userId);

  // Add user wizard
  const [wizardOpen, setWizardOpen] = useState(false);

  // Send email dialog
  const [emailUser, setEmailUser] = useState<IUser | null>(null);

  // Toggle-active confirmation dialog
  const [confirmUser, setConfirmUser] = useState<IUser | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleSendEmail = (user: IUser) => {
    setEmailUser(user);
  };

  const handleToggleActive = (user: IUser) => {
    setConfirmUser(user);
  };

  const handleConfirmToggle = async () => {
    if (!confirmUser) return;
    setIsToggling(true);
    try {
      await setUserActive({
        userId: confirmUser.userId,
        isActive: !confirmUser.isActive,
      }).unwrap();
      setConfirmUser(null);
    } catch {
      toast.error(t("users.sendEmailDialog.errorTitle"));
    } finally {
      setIsToggling(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const columns = useUsersColumns(
    currentUserId,
    handleSendEmail,
    handleToggleActive,
  );
  const users = response?.data ?? [];

  const confirmName = confirmUser?.fullName ?? confirmUser?.email ?? "";

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("users.page.title")}
          </h1>
          <p className="text-muted-foreground">{t("users.page.description")}</p>
        </div>
      </div>

      <DataTableV2WithContext<IUser>
        data={users}
        columns={columns}
        isLoading={isLoading}
        showToolbar
        showQuickSearch
        showColumnVisibility
        showPagination
        toolbarContent={
          <Button onClick={() => setWizardOpen(true)} size="sm" className="h-8">
            <UserPlus className="h-4 w-4 me-1" />
            {t("users.page.addUser")}
          </Button>
        }
        labels={{
          search: t("users.table.search"),
          noResults: t("users.table.noResults"),
          rowsPerPage: t("users.table.rowsPerPage"),
          columns: t("users.table.columns"),
        }}
      />

      {/* Add User Wizard */}
      <AddUserWizard open={wizardOpen} onOpenChange={setWizardOpen} />

      {/* Send Email Dialog */}
      <SendEmailDialog
        open={!!emailUser}
        onOpenChange={(open) => {
          if (!open) setEmailUser(null);
        }}
        user={emailUser}
      />

      {/* Toggle Active Confirmation */}
      <AlertDialog
        open={!!confirmUser}
        onOpenChange={(open) => {
          if (!open) setConfirmUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmUser?.isActive
                ? t("users.toggleActiveDialog.deactivateTitle")
                : t("users.toggleActiveDialog.activateTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmUser?.isActive
                ? t("users.toggleActiveDialog.deactivateDescription", {
                    name: confirmName,
                  })
                : t("users.toggleActiveDialog.activateDescription", {
                    name: confirmName,
                  })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>
              {t("users.toggleActiveDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmToggle}
              disabled={isToggling}
              className={
                confirmUser?.isActive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {t("users.toggleActiveDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
