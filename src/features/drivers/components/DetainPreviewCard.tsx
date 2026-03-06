import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Separator } from "@shared/ui/separator";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  useGetDetainPreviewQuery,
  useDetainLicenseMutation,
} from "../store/detainedLicenseApi";
import type { IDetainLicenseResponse } from "../store/detainedLicenseApi";
import { Field } from "./LicenseInfoCard";

interface DetainPreviewCardProps {
  licenseId: number;
}

export function DetainPreviewCard({ licenseId }: DetainPreviewCardProps) {
  const { t } = useTranslation();
  const [fineFees, setFineFees] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState<IDetainLicenseResponse | null>(null);

  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetDetainPreviewQuery(licenseId);

  const [detainLicense, { isLoading: detaining }] = useDetainLicenseMutation();

  const preview = previewData?.data;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleDetain = async () => {
    const fees = parseFloat(fineFees);
    if (!fees || fees <= 0) return;
    const result = await detainLicense({
      licenseId,
      body: { fineFees: fees, notes: notes || null },
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
              {t("drivers.detainLicense.success.title")}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("drivers.detainLicense.success.subtitle")}
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field
            label={t("drivers.detainLicense.success.detainId")}
            value={success.detainId}
            highlight
          />
          <Field
            label={t("drivers.detainLicense.success.licenseId")}
            value={success.licenseId}
          />
          <Field
            label={t("drivers.detainLicense.success.detainDate")}
            value={fmt(success.detainDate)}
          />
          <Field
            label={t("drivers.detainLicense.success.fineFees")}
            value={`$${success.fineFees.toFixed(2)}`}
            highlight
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
        {t("drivers.detainLicense.loadingPreview")}
      </div>
    );
  }

  // ── Error / validation failure ──────────────────────────────────
  if (previewError || !preview) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (previewError as any)?.data?.message ??
      t("drivers.detainLicense.previewError");

    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-destructive">
            {t("drivers.detainLicense.cannotDetain")}
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
          {t("drivers.detainLicense.previewTitle")}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("drivers.detainLicense.previewSubtitle")}
        </p>
      </div>

      <Separator />

      {/* License summary */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Field
          label={t("drivers.detainLicense.licenseClass")}
          value={preview.className}
          highlight
        />
        <Field
          label={t("drivers.detainLicense.issueDate")}
          value={fmt(preview.issueDate)}
        />
        <Field
          label={t("drivers.detainLicense.expiryDate")}
          value={fmt(preview.expirationDate)}
        />
        <Field
          label={t("drivers.detainLicense.paidFees")}
          value={`$${preview.licensePaidFees.toFixed(2)}`}
        />
      </div>

      <Separator />

      {/* Fine fees input */}
      <div className="space-y-1.5">
        <Label htmlFor="detain-fine-fees">
          {t("drivers.detainLicense.fineFees")}
          <span className="text-destructive ml-1">*</span>
        </Label>
        <Input
          id="detain-fine-fees"
          type="number"
          min={0.01}
          step={0.01}
          placeholder={t("drivers.detainLicense.fineFeesPlaceholder")}
          value={fineFees}
          onChange={(e) => setFineFees(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="detain-notes">{t("drivers.detainLicense.notes")}</Label>
        <Textarea
          id="detain-notes"
          placeholder={t("drivers.detainLicense.notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Detain button */}
      <div className="flex justify-end">
        <Button
          onClick={handleDetain}
          disabled={detaining || !fineFees || parseFloat(fineFees) <= 0}
          variant="destructive"
          className="min-w-36"
        >
          {detaining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("drivers.detainLicense.detaining")}
            </>
          ) : (
            t("drivers.detainLicense.detainBtn")
          )}
        </Button>
      </div>
    </div>
  );
}
