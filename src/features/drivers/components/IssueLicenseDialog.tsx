import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Separator } from "@shared/ui/separator";
import { useGetLdlaDetailsQuery } from "@features/tests/store/testAppointmentsApi";
import { useIssueLicenseFirstTimeMutation } from "../store/driverApi";

interface IssueLicenseDialogProps {
  applicationId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IssueLicenseDialog({
  applicationId,
  open,
  onOpenChange,
}: IssueLicenseDialogProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");

  const { data: detailsData, isLoading: detailsLoading } =
    useGetLdlaDetailsQuery(applicationId, { skip: !open });

  const ldla = detailsData?.data;

  const [issueLicense, { isLoading: issuing }] =
    useIssueLicenseFirstTimeMutation();

  const handleClose = () => {
    setNotes("");
    onOpenChange(false);
  };

  const handleIssue = async () => {
    if (!ldla) return;
    await issueLicense({
      ldlaId: ldla.localDrivingLicenseApplicationId,
      body: { notes: notes || null },
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{t("drivers.issueLicense.title")}</DialogTitle>
        </DialogHeader>

        {detailsLoading ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Loading…
          </div>
        ) : ldla ? (
          <>
            {/* LDLA Info */}
            <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("drivers.issueLicense.ldlaId")}
                </span>
                <span className="font-medium">{ldla.applicationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("drivers.issueLicense.class")}
                </span>
                <span className="font-medium">{ldla.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {t("drivers.issueLicense.name")}
                </span>
                <span className="font-medium">{ldla.fullName}</span>
              </div>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="issue-notes">
                {t("drivers.issueLicense.notes")}
              </Label>
              <Textarea
                id="issue-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t("drivers.issueLicense.notesPlaceholder")}
                rows={3}
              />
            </div>
          </>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("drivers.issueLicense.cancel")}
          </Button>
          <Button onClick={handleIssue} disabled={!ldla || issuing}>
            {issuing
              ? t("drivers.issueLicense.issuing")
              : t("drivers.issueLicense.issueBtn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
