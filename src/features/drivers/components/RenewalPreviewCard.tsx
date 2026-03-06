import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Separator } from "@shared/ui/separator";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  useGetRenewalPreviewQuery,
  useRenewLicenseMutation,
} from "../store/renewalApi";
import type { IRenewLicenseResponse } from "../store/renewalApi";
import { Field } from "./LicenseInfoCard";

interface RenewalPreviewCardProps {
  licenseId: number;
}

export function RenewalPreviewCard({ licenseId }: RenewalPreviewCardProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<IRenewLicenseResponse | null>(null);

  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetRenewalPreviewQuery(licenseId);

  const [renewLicense, { isLoading: renewing }] = useRenewLicenseMutation();

  const preview = previewData?.data;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleRenew = async () => {
    const result = await renewLicense({
      licenseId,
      body: { notes: notes || null },
    });
    if ("data" in result && result.data?.data) {
      setSuccess(result.data.data);
    }
  };

  // ── Success state ───────────────────────────────────────────────
  if (success) {
    return (
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
          <CheckCircle className="w-6 h-6 shrink-0" />
          <div>
            <p className="font-semibold text-base">
              {t("drivers.renewLicense.success.title")}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("drivers.renewLicense.success.subtitle")}
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field
            label={t("drivers.renewLicense.success.newLicenseId")}
            value={success.newLicenseId}
            highlight
          />
          <Field
            label={t("drivers.renewLicense.success.newApplicationId")}
            value={success.newApplicationId}
          />
          <Field
            label={t("drivers.renewLicense.success.oldLicenseId")}
            value={success.oldLicenseId}
          />
          <Field
            label={t("drivers.renewLicense.success.totalFees")}
            value={`$${success.totalFees.toFixed(2)}`}
          />
          <Field
            label={t("drivers.renewLicense.success.newIssueDate")}
            value={fmt(success.newIssueDate)}
          />
          <Field
            label={t("drivers.renewLicense.success.newExpiryDate")}
            value={fmt(success.newExpirationDate)}
          />
        </div>
      </div>
    );
  }

  // ── Loading state ───────────────────────────────────────────────
  if (previewLoading) {
    return (
      <div className="rounded-lg border bg-card p-6 flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        {t("drivers.renewLicense.loadingPreview")}
      </div>
    );
  }

  // ── Error / validation failure ──────────────────────────────────
  if (previewError || !preview) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (previewError as any)?.data?.message ??
      t("drivers.renewLicense.previewError");

    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-destructive">
            {t("drivers.renewLicense.cannotRenew")}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
    );
  }

  // ── Preview ─────────────────────────────────────────────────────
  return (
    <div className="rounded-lg border bg-card p-6 space-y-5">
      <div>
        <h3 className="font-semibold text-base">
          {t("drivers.renewLicense.previewTitle")}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("drivers.renewLicense.previewSubtitle")}
        </p>
      </div>

      <Separator />

      {/* Fees breakdown + new dates */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Field
          label={t("drivers.renewLicense.newIssueDate")}
          value={fmt(preview.newIssueDate)}
          highlight
        />
        <Field
          label={t("drivers.renewLicense.newExpiryDate")}
          value={fmt(preview.newExpirationDate)}
          highlight
        />
        <Field
          label={t("drivers.renewLicense.applicationFees")}
          value={`$${preview.applicationFees.toFixed(2)}`}
        />
        <Field
          label={t("drivers.renewLicense.licenseFees")}
          value={`$${preview.licenseFees.toFixed(2)}`}
        />
        <div className="col-span-2">
          <Field
            label={t("drivers.renewLicense.totalFees")}
            value={`$${preview.totalFees.toFixed(2)}`}
            highlight
          />
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="renewal-notes">{t("drivers.renewLicense.notes")}</Label>
        <Textarea
          id="renewal-notes"
          placeholder={t("drivers.renewLicense.notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Renew button */}
      <div className="flex justify-end">
        <Button onClick={handleRenew} disabled={renewing} className="min-w-32">
          {renewing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("drivers.renewLicense.renewing")}
            </>
          ) : (
            t("drivers.renewLicense.renewBtn")
          )}
        </Button>
      </div>
    </div>
  );
}
