import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { useLazyGetLicenseByIdQuery } from "../store/driverApi";
import { LicenseInfoCard } from "../components/LicenseInfoCard";
import { RenewalPreviewCard } from "../components/RenewalPreviewCard";

export function RenewLicensePage() {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [searchedId, setSearchedId] = useState<number | null>(null);

  const [getLicense, { data, isFetching, isError, error }] =
    useLazyGetLicenseByIdQuery();

  const license = data?.data;

  const errorMessage =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)?.data?.message ?? t("drivers.renewLicense.licenseNotFound");

  const handleFind = () => {
    const id = parseInt(inputValue, 10);
    if (!id || isNaN(id)) return;
    setSearchedId(id);
    getLicense(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleFind();
  };

  return (
    <div className=" space-y-6 p-6">
      {/* ── Page header ───────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold">
          {t("drivers.renewLicense.pageTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("drivers.renewLicense.pageDescription")}
        </p>
      </div>

      {/* ── Search card ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("drivers.renewLicense.searchTitle")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              placeholder={t("drivers.renewLicense.licenseIdPlaceholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="max-w-xs"
            />
            <Button onClick={handleFind} disabled={isFetching || !inputValue}>
              {isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="ml-2">{t("drivers.renewLicense.findBtn")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Error: license not found ──────────────────────────────── */}
      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{errorMessage}</p>
        </div>
      )}

      {/* ── Current license info (reused component) ───────────────── */}
      {(license || isFetching) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t("drivers.renewLicense.currentLicenseTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LicenseInfoCard license={license} isLoading={isFetching} />
          </CardContent>
        </Card>
      )}

      {/* ── Renewal application info (new component) ──────────────── */}
      {license && searchedId && <RenewalPreviewCard licenseId={searchedId} />}
    </div>
  );
}
