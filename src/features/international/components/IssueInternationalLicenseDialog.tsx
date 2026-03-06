import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import {
  useLazyValidateLicenseForInternationalQuery,
  useIssueInternationalLicenseMutation,
} from "../store/internationalLicenseApi";
import type { ILicenseDetails } from "@features/drivers";

// ── Field ────────────────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold">
        {value ?? (
          <span className="text-xs font-normal italic text-muted-foreground">
            —
          </span>
        )}
      </span>
    </div>
  );
}

// ── Local License Info Card ───────────────────────────────────────────────────
function LocalLicenseCard({ license }: { license: ILicenseDetails }) {
  const { t } = useTranslation();
  const gender =
    license.gender === 1
      ? t("drivers.licenseDetails.genders.male")
      : license.gender === 2
        ? t("drivers.licenseDetails.genders.female")
        : "—";

  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {license.imagePath ? (
            <img
              src={license.imagePath}
              alt={license.fullName}
              className="h-20 w-20 rounded-lg object-cover border"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-lg border bg-muted">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
          <Field
            label={t("drivers.licenseDetails.fullName")}
            value={license.fullName}
          />
          <Field
            label={t("drivers.licenseDetails.nationalNo")}
            value={license.nationalNo}
          />
          <Field label={t("drivers.licenseDetails.gender")} value={gender} />
          <Field
            label={t("drivers.licenseDetails.dob")}
            value={
              license.dateOfBirth
                ? new Date(license.dateOfBirth).toLocaleDateString()
                : undefined
            }
          />
          <Field
            label={t("drivers.licenseDetails.nationality")}
            value={license.nationality}
          />
          <Field
            label={t("drivers.licenseDetails.phone")}
            value={license.phone}
          />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Field
          label={t("drivers.licenseDetails.licenseId")}
          value={license.licenseId}
        />
        <Field
          label={t("drivers.licenseDetails.class")}
          value={license.className}
        />
        <Field
          label={t("drivers.licenseDetails.issueDate")}
          value={new Date(license.issueDate).toLocaleDateString()}
        />
        <Field
          label={t("drivers.licenseDetails.expiryDate")}
          value={new Date(license.expirationDate).toLocaleDateString()}
        />
        <Field
          label={t("drivers.licenseDetails.issuedBy")}
          value={license.createdByUsername}
        />
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            {t("drivers.licenseDetails.driverId")}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold">{license.driverId}</span>
            {license.isDetained && (
              <Badge variant="destructive" className="text-[10px]">
                {t("drivers.licenseDetails.detained")}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface IssueInternationalLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ── Dialog ────────────────────────────────────────────────────────────────────
export function IssueInternationalLicenseDialog({
  open,
  onOpenChange,
}: IssueInternationalLicenseDialogProps) {
  const { t } = useTranslation();

  const [licenseIdInput, setLicenseIdInput] = useState("");
  const [validatedLicense, setValidatedLicense] =
    useState<ILicenseDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [validateTrigger, { isFetching: isValidating }] =
    useLazyValidateLicenseForInternationalQuery();

  const [issue, { isLoading: isIssuing }] =
    useIssueInternationalLicenseMutation();

  const reset = () => {
    setLicenseIdInput("");
    setValidatedLicense(null);
    setErrorMsg(null);
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  const handleValidate = async () => {
    const id = parseInt(licenseIdInput, 10);
    if (isNaN(id) || id <= 0) return;
    setValidatedLicense(null);
    setErrorMsg(null);
    const result = await validateTrigger(id);
    if (result.data?.data) {
      setValidatedLicense(result.data.data);
    } else if (result.error) {
      const errData = (result.error as { data?: { message?: string } }).data;
      setErrorMsg(
        errData?.message ?? t("international.issuePage.validationFailed"),
      );
    }
  };

  const handleIssue = async () => {
    if (!validatedLicense) return;
    const result = await issue(validatedLicense.licenseId);
    if ("data" in result && result.data?.data) {
      // Success — close dialog (RTK Query invalidation will refresh the table)
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("international.issuePage.title")}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {t("international.issuePage.description")}
          </p>
        </DialogHeader>

        {/* Search row */}
        <div className="flex gap-2">
          <Input
            type="number"
            min={1}
            placeholder={t("international.issuePage.licenseIdPlaceholder")}
            value={licenseIdInput}
            onChange={(e) => {
              setLicenseIdInput(e.target.value);
              setValidatedLicense(null);
              setErrorMsg(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleValidate();
            }}
            className="w-44"
          />
          <Button
            onClick={() => void handleValidate()}
            disabled={!licenseIdInput || isValidating}
          >
            <Search className="me-2 h-4 w-4" />
            {isValidating
              ? t("international.issuePage.searching")
              : t("international.issuePage.searchBtn")}
          </Button>
        </div>

        {/* Error */}
        {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

        {/* License card + Issue button */}
        {validatedLicense && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {t("international.issuePage.localLicenseSection")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocalLicenseCard license={validatedLicense} />
              <div className="mt-4 flex justify-end">
                <Button onClick={() => void handleIssue()} disabled={isIssuing}>
                  {isIssuing
                    ? t("international.issuePage.issuing")
                    : t("international.issuePage.issueBtn")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
