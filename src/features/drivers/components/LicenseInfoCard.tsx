import { useTranslation } from "react-i18next";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { User } from "lucide-react";
import type { ILicenseDetails } from "../store/driverApi";

// eslint-disable-next-line react-refresh/only-export-components
export const ISSUE_REASON_KEYS: Record<number, string> = {
  1: "drivers.licenseDetails.issueReasons.firstTime",
  2: "drivers.licenseDetails.issueReasons.renewal",
  3: "drivers.licenseDetails.issueReasons.replacementDamaged",
  4: "drivers.licenseDetails.issueReasons.replacementLost",
};

// eslint-disable-next-line react-refresh/only-export-components
export const GENDER_KEYS: Record<number, string> = {
  1: "drivers.licenseDetails.genders.male",
  2: "drivers.licenseDetails.genders.female",
};

export function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground font-medium">
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${highlight ? "text-primary" : ""}`}
      >
        {value ?? (
          <span className="text-muted-foreground font-normal italic text-xs">
            —
          </span>
        )}
      </span>
    </div>
  );
}

interface LicenseInfoCardProps {
  license: ILicenseDetails | null | undefined;
  isLoading?: boolean;
}

export function LicenseInfoCard({ license, isLoading }: LicenseInfoCardProps) {
  const { t } = useTranslation();

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        Loading...
      </div>
    );
  }

  if (!license) return null;

  const photoSrc = license.imagePath ?? null;

  return (
    <div>
      {/* ── Top strip: photo + name + class + badges ──────────── */}
      <div className="flex gap-4 items-start mb-4">
        <div className="shrink-0 w-24 h-28 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
          {photoSrc ? (
            <img
              src={photoSrc}
              alt={license.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-xl font-bold text-primary leading-tight truncate">
            {license.fullName}
          </p>
          <p className="text-sm text-muted-foreground">
            {license.className}
            {license.classDescription && (
              <span className="ml-1 text-xs">— {license.classDescription}</span>
            )}
          </p>
          <div className="flex gap-2 flex-wrap pt-1">
            <Badge variant={license.isActive ? "default" : "secondary"}>
              {license.isActive
                ? t("drivers.licenseDetails.active")
                : t("drivers.licenseDetails.inactive")}
            </Badge>
            {license.isDetained && (
              <Badge variant="destructive">
                {t("drivers.licenseDetails.detained")}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* ── Info grid: 2 columns ───────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <Field
          label={t("drivers.licenseDetails.licenseId")}
          value={license.licenseId}
        />
        <Field
          label={t("drivers.licenseDetails.driverId")}
          value={license.driverId}
        />

        <Field
          label={t("drivers.licenseDetails.nationalNo")}
          value={license.nationalNo}
        />
        <Field
          label={t("drivers.licenseDetails.dob")}
          value={
            license.dateOfBirth
              ? new Date(license.dateOfBirth).toLocaleDateString()
              : null
          }
        />

        <Field
          label={t("drivers.licenseDetails.gender")}
          value={
            license.gender != null ? t(GENDER_KEYS[license.gender] ?? "") : null
          }
        />
        <Field
          label={t("drivers.licenseDetails.nationality")}
          value={license.nationality}
        />

        <Field
          label={t("drivers.licenseDetails.issueDate")}
          value={fmt(license.issueDate)}
        />
        <Field
          label={t("drivers.licenseDetails.expiryDate")}
          value={fmt(license.expirationDate)}
        />

        <Field
          label={t("drivers.licenseDetails.issueReason")}
          value={t(
            ISSUE_REASON_KEYS[license.issueReason] ??
              "drivers.licenseDetails.issueReasons.unknown",
          )}
        />
        <Field
          label={t("drivers.licenseDetails.driverSince")}
          value={fmt(license.driverSince)}
        />

        <Field
          label={t("drivers.licenseDetails.applicationId")}
          value={license.applicationId}
        />
        <Field
          label={t("drivers.licenseDetails.fees")}
          value={`$${license.paidFees.toFixed(2)}`}
        />

        <Field
          label={t("drivers.licenseDetails.issuedBy")}
          value={license.createdByUsername}
        />

        {(license.phone || license.email) && (
          <Field
            label={t("drivers.licenseDetails.phone")}
            value={license.phone}
          />
        )}

        {license.email && (
          <Field
            label={t("drivers.licenseDetails.email")}
            value={license.email}
          />
        )}

        {license.address && (
          <div className="col-span-2">
            <Field
              label={t("drivers.licenseDetails.address")}
              value={license.address}
            />
          </div>
        )}

        {license.notes && (
          <div className="col-span-2">
            <Field
              label={t("drivers.licenseDetails.notes")}
              value={license.notes}
            />
          </div>
        )}
      </div>
    </div>
  );
}
