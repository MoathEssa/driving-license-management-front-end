import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Ban,
  MoreHorizontal,
  ClipboardList,
  Eye,
  PenLine,
  BadgeCheck,
  ChevronRight,
  FileText,
  History,
} from "lucide-react";
import { Button } from "@shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";
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
import type { ILocalDrivingLicenseApplicationView } from "../store/localDrivingLicenseApi";
import { useCancelLocalDrivingLicenseApplicationMutation } from "../store/localDrivingLicenseApi";
import { TestAppointmentsDialog } from "@features/tests/testAppointments/components/TestAppointmentsDialog";
import { IssueLicenseDialog } from "@features/drivers/components/IssueLicenseDialog";
import { LicenseDetailsDialog } from "@features/drivers/components/LicenseDetailsDialog";
import { PersonHistoryDialog } from "@features/drivers/components/PersonHistoryDialog";
import { TestType } from "@shared/constants";

// Test types list derived from constants
const TEST_TYPES = [
  { id: TestType.Vision as 1, key: "vision" },
  { id: TestType.Written as 2, key: "written" },
  { id: TestType.Practical as 3, key: "practical" },
] as const;

export function ActionsCell({
  row,
}: {
  row: { original: ILocalDrivingLicenseApplicationView };
}) {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTestTypeId, setActiveTestTypeId] = useState<1 | 2 | 3 | null>(
    null,
  );
  const [issueLicenseOpen, setIssueLicenseOpen] = useState(false);
  const [licenseDetailsOpen, setLicenseDetailsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const isCompleted = row.original.status === 3;

  const [cancel, { isLoading }] =
    useCancelLocalDrivingLicenseApplicationMutation();

  const isNew = row.original.status === 1;
  const passedTests = (row.original.passedTests as number) ?? 0;
  const ldlaId = row.original.localDrivingLicenseApplicationId as number;
  const applicationId = row.original.applicationId as number;

  // Unlock logic (sequential: Vision → Written → Practical)
  const canScheduleVision = isNew;
  const canScheduleWritten = isNew && passedTests >= 1;
  const canSchedulePractical = isNew && passedTests >= 2;
  const canIssueLicense = isNew && passedTests >= 3;

  const testTypeLabels: Record<1 | 2 | 3, string> = {
    1: t("applications.localDrivingLicense.actions.vision"),
    2: t("applications.localDrivingLicense.actions.written"),
    3: t("applications.localDrivingLicense.actions.practical"),
  };
  const testTypeEnabled: Record<1 | 2 | 3, boolean> = {
    1: canScheduleVision,
    2: canScheduleWritten,
    3: canSchedulePractical,
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">
              {t("applications.localDrivingLicense.actions.openMenu")}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            {t("applications.localDrivingLicense.actions.label")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Schedule Tests sub-menu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger
              disabled={!isNew}
              className={
                !isNew
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : ""
              }
            >
              <ClipboardList className="me-2 h-4 w-4" />
              {t("applications.localDrivingLicense.actions.scheduleTests")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {TEST_TYPES.map((tt) => (
                <DropdownMenuItem
                  key={tt.id}
                  disabled={!testTypeEnabled[tt.id]}
                  onSelect={() => {
                    setDropdownOpen(false);
                    setActiveTestTypeId(tt.id);
                  }}
                >
                  {tt.id === 1 ? (
                    <Eye className="me-2 h-4 w-4" />
                  ) : tt.id === 2 ? (
                    <PenLine className="me-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="me-2 h-4 w-4" />
                  )}
                  {testTypeLabels[tt.id]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Issue License */}
          <DropdownMenuItem
            disabled={!canIssueLicense}
            onSelect={() => {
              setDropdownOpen(false);
              setIssueLicenseOpen(true);
            }}
          >
            <BadgeCheck className="me-2 h-4 w-4" />
            {t("applications.localDrivingLicense.actions.issueLicense")}
          </DropdownMenuItem>

          {/* View License (completed apps) */}
          {isCompleted && (
            <DropdownMenuItem
              onSelect={() => {
                setDropdownOpen(false);
                setLicenseDetailsOpen(true);
              }}
            >
              <FileText className="me-2 h-4 w-4" />
              {t("applications.localDrivingLicense.actions.viewLicense")}
            </DropdownMenuItem>
          )}

          {/* License History (always visible) */}
          <DropdownMenuItem
            onSelect={() => {
              setDropdownOpen(false);
              setHistoryOpen(true);
            }}
          >
            <History className="me-2 h-4 w-4" />
            {t("applications.localDrivingLicense.actions.licenseHistory")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Cancel */}
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            disabled={!isNew}
            onSelect={() => {
              setDropdownOpen(false);
              setConfirmOpen(true);
            }}
          >
            <Ban className="me-2 h-4 w-4" />
            {t("applications.localDrivingLicense.actions.cancel")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Cancel confirmation */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("applications.localDrivingLicense.actions.cancelConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "applications.localDrivingLicense.actions.cancelConfirmDescription",
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("applications.localDrivingLicense.actions.cancelCancelBtn")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
              onClick={async (e) => {
                e.preventDefault();
                await cancel(ldlaId);
                setConfirmOpen(false);
              }}
            >
              {isLoading
                ? "…"
                : t(
                    "applications.localDrivingLicense.actions.cancelConfirmBtn",
                  )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Test Appointments dialog (per type) */}
      {activeTestTypeId !== null && (
        <TestAppointmentsDialog
          applicationId={applicationId}
          testTypeId={activeTestTypeId}
          testTypeTitle={testTypeLabels[activeTestTypeId]}
          open={activeTestTypeId !== null}
          onOpenChange={(o) => {
            if (!o) setActiveTestTypeId(null);
          }}
        />
      )}

      {/* Issue License dialog */}
      <IssueLicenseDialog
        applicationId={applicationId}
        open={issueLicenseOpen}
        onOpenChange={setIssueLicenseOpen}
      />

      {/* License Details dialog (completed apps) */}
      <LicenseDetailsDialog
        applicationId={applicationId}
        open={licenseDetailsOpen}
        onOpenChange={setLicenseDetailsOpen}
      />

      {/* Person License History dialog */}
      <PersonHistoryDialog
        nationalNo={row.original.nationalNo ?? null}
        personName={row.original.fullName as string}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </>
  );
}
