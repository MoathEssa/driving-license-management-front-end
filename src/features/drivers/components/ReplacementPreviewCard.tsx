import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@shared/ui/button";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { Separator } from "@shared/ui/separator";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import {
  useGetReplacementPreviewQuery,
  useReplaceLicenseMutation,
} from "../store/replacementApi";
import type { IReplaceLicenseResponse } from "../store/replacementApi";
import { Field } from "./LicenseInfoCard";

interface ReplacementPreviewCardProps {
  licenseId: number;
}

export function ReplacementPreviewCard({
  licenseId,
}: ReplacementPreviewCardProps) {
  const { t } = useTranslation();
  const [notes, setNotes] = useState("");
  const [reasonType, setReasonType] = useState<1 | 2>(1); // 1=Damaged, 2=Lost
  const [success, setSuccess] = useState<IReplaceLicenseResponse | null>(null);

  const {
    data: previewData,
    isLoading: previewLoading,
    error: previewError,
  } = useGetReplacementPreviewQuery(licenseId);

  const [replaceLicense, { isLoading: replacing }] =
    useReplaceLicenseMutation();

  const preview = previewData?.data;

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleReplace = async () => {
    const result = await replaceLicense({
      licenseId,
      body: { reasonType, notes: notes || null },
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
              {t("drivers.replaceLicense.success.title")}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("drivers.replaceLicense.success.subtitle")}
            </p>
          </div>
        </div>
        <Separator />
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field
            label={t("drivers.replaceLicense.success.newLicenseId")}
            value={success.newLicenseId}
            highlight
          />
          <Field
            label={t("drivers.replaceLicense.success.newApplicationId")}
            value={success.newApplicationId}
          />
          <Field
            label={t("drivers.replaceLicense.success.oldLicenseId")}
            value={success.oldLicenseId}
          />
          <Field
            label={t("drivers.replaceLicense.success.totalFees")}
            value={`$${success.totalFees.toFixed(2)}`}
          />
          <Field
            label={t("drivers.replaceLicense.success.newIssueDate")}
            value={fmt(success.newIssueDate)}
          />
          <Field
            label={t("drivers.replaceLicense.success.newExpiryDate")}
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
        {t("drivers.replaceLicense.loadingPreview")}
      </div>
    );
  }

  // ── Error / validation failure ──────────────────────────────────
  if (previewError || !preview) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (previewError as any)?.data?.message ??
      t("drivers.replaceLicense.previewError");

    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm text-destructive">
            {t("drivers.replaceLicense.cannotReplace")}
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
          {t("drivers.replaceLicense.previewTitle")}
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t("drivers.replaceLicense.previewSubtitle")}
        </p>
      </div>

      <Separator />

      {/* Reason radio group */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          {t("drivers.replaceLicense.reasonType")}
        </p>
        <RadioGroup
          value={String(reasonType)}
          onValueChange={(v) => setReasonType(Number(v) as 1 | 2)}
          className="flex gap-6"
        >
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <RadioGroupItem value="1" id="reason-damaged" />
            <Label htmlFor="reason-damaged">
              {t("drivers.replaceLicense.damaged")}
            </Label>
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <RadioGroupItem value="2" id="reason-lost" />
            <Label htmlFor="reason-lost">
              {t("drivers.replaceLicense.lost")}
            </Label>
          </label>
        </RadioGroup>
      </div>

      <Separator />

      {/* Fees breakdown + new dates */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Field
          label={t("drivers.replaceLicense.newIssueDate")}
          value={fmt(preview.newIssueDate)}
          highlight
        />
        <Field
          label={t("drivers.replaceLicense.newExpiryDate")}
          value={fmt(preview.newExpirationDate)}
          highlight
        />
        <Field
          label={t("drivers.replaceLicense.applicationFees")}
          value={`$${preview.applicationFees.toFixed(2)}`}
        />
        <Field
          label={t("drivers.replaceLicense.licenseFees")}
          value={`$${preview.licenseFees.toFixed(2)}`}
        />
        <div className="col-span-2">
          <Field
            label={t("drivers.replaceLicense.totalFees")}
            value={`$${preview.totalFees.toFixed(2)}`}
            highlight
          />
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="replacement-notes">
          {t("drivers.replaceLicense.notes")}
        </Label>
        <Textarea
          id="replacement-notes"
          placeholder={t("drivers.replaceLicense.notesPlaceholder")}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      {/* Issue button */}
      <div className="flex justify-end">
        <Button
          onClick={handleReplace}
          disabled={replacing}
          className="min-w-36"
        >
          {replacing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("drivers.replaceLicense.issuing")}
            </>
          ) : (
            t("drivers.replaceLicense.issueBtn")
          )}
        </Button>
      </div>
    </div>
  );
}
