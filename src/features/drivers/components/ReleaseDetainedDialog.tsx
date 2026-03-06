import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Separator } from "@shared/ui/separator";
import { CheckCircle, Loader2 } from "lucide-react";
import { useReleaseLicenseMutation } from "../store/detainedLicenseApi";
import type {
  IDetainedLicenseView,
  IReleaseLicenseResponse,
} from "../store/detainedLicenseApi";
import { Field } from "./LicenseInfoCard";

interface ReleaseDetainedDialogProps {
  detainedLicense: IDetainedLicenseView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReleaseDetainedDialog({
  detainedLicense,
  open,
  onOpenChange,
}: ReleaseDetainedDialogProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<IReleaseLicenseResponse | null>(null);

  const [releaseLicense, { isLoading: releasing }] =
    useReleaseLicenseMutation();

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleRelease = async () => {
    const result = await releaseLicense({
      detainId: detainedLicense.detainId,
      body: { notes: notes || null },
    });
    if ("data" in result && result.data?.data) {
      setSuccess(result.data.data);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setNotes("");
      setSuccess(null);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("drivers.releaseDetained.title")}</DialogTitle>
          <DialogDescription>
            {t("drivers.releaseDetained.description")}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          /* ── Success ─────────────────────────────────────────── */
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-semibold text-base">
                  {t("drivers.releaseDetained.success.title")}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("drivers.releaseDetained.success.subtitle")}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Field
                label={t("drivers.releaseDetained.success.detainId")}
                value={success.detainId}
              />
              <Field
                label={t("drivers.releaseDetained.success.applicationId")}
                value={success.releaseApplicationId}
                highlight
              />
              <Field
                label={t("drivers.releaseDetained.success.licenseId")}
                value={success.licenseId}
              />
              <Field
                label={t("drivers.releaseDetained.success.releaseDate")}
                value={fmt(success.releaseDate)}
                highlight
              />
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="outline" onClick={() => handleClose(false)}>
                {t("drivers.releaseDetained.close")}
              </Button>
            </div>
          </div>
        ) : (
          /* ── Confirm release ─────────────────────────────────── */
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm rounded-lg border p-4">
              <Field
                label={t("drivers.releaseDetained.detainId")}
                value={detainedLicense.detainId}
              />
              <Field
                label={t("drivers.releaseDetained.licenseId")}
                value={detainedLicense.licenseId}
              />
              <Field
                label={t("drivers.releaseDetained.fullName")}
                value={detainedLicense.fullName}
              />
              <Field
                label={t("drivers.releaseDetained.detainDate")}
                value={fmt(detainedLicense.detainDate)}
              />
              <Field
                label={t("drivers.releaseDetained.fineFees")}
                value={`$${detainedLicense.fineFees.toFixed(2)}`}
                highlight
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="release-notes">
                {t("drivers.releaseDetained.notes")}
              </Label>
              <Textarea
                id="release-notes"
                placeholder={t("drivers.releaseDetained.notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={releasing}
              >
                {t("drivers.releaseDetained.cancel")}
              </Button>
              <Button onClick={handleRelease} disabled={releasing}>
                {releasing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("drivers.releaseDetained.releasing")}
                  </>
                ) : (
                  t("drivers.releaseDetained.releaseBtn")
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
