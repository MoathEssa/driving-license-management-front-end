import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@shared/ui/tabs";
import { useGetDriverLicensesQuery } from "../store/driverApi";
import { useGetInternationalLicensesByDriverIdQuery } from "@features/international/store/internationalLicenseApi";

interface DriverLicensesDialogProps {
  driverId: number;
  driverName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DriverLicensesDialog({
  driverId,
  driverName,
  open,
  onOpenChange,
}: DriverLicensesDialogProps) {
  const { t } = useTranslation();

  const { data: localData, isLoading: localLoading } =
    useGetDriverLicensesQuery(driverId, {
      skip: !open,
    });

  const { data: intlData, isLoading: intlLoading } =
    useGetInternationalLicensesByDriverIdQuery(driverId, {
      skip: !open,
    });

  const licenses = localData?.data ?? [];
  const intlLicenses = intlData?.data ?? [];

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("drivers.driverLicenses.title", { name: driverName })}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="local">
          <TabsList className="w-full">
            <TabsTrigger value="local" className="flex-1">
              {t("drivers.driverLicenses.tabs.local")}
            </TabsTrigger>
            <TabsTrigger value="international" className="flex-1">
              {t("drivers.driverLicenses.tabs.international")}
            </TabsTrigger>
          </TabsList>

          {/* ── Local tab ──────────────────────────────────────────── */}
          <TabsContent value="local" className="mt-4">
            {localLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Loading…
              </div>
            ) : licenses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                {t("drivers.driverLicenses.noLicenses")}
              </div>
            ) : (
              <div className="space-y-3">
                {licenses.map((lic) => (
                  <div
                    key={lic.licenseId}
                    className="rounded-md border p-3 text-sm space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{lic.className}</span>
                      <div className="flex gap-1">
                        <Badge
                          variant={lic.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {lic.isActive
                            ? t("drivers.licenseDetails.active")
                            : t("drivers.licenseDetails.inactive")}
                        </Badge>
                        {lic.isDetained && (
                          <Badge variant="destructive" className="text-xs">
                            {t("drivers.licenseDetails.detained")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.licenseId")}
                      </span>
                      <span className="font-medium">{lic.licenseId}</span>
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.issueDate")}
                      </span>
                      <span>{formatDate(lic.issueDate)}</span>
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.expiryDate")}
                      </span>
                      <span>{formatDate(lic.expirationDate)}</span>
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.fees")}
                      </span>
                      <span>${lic.paidFees.toFixed(2)}</span>
                      {lic.notes && (
                        <>
                          <span className="text-muted-foreground">
                            {t("drivers.licenseDetails.notes")}
                          </span>
                          <span>{lic.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── International tab ──────────────────────────────────── */}
          <TabsContent value="international" className="mt-4">
            {intlLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                Loading…
              </div>
            ) : intlLicenses.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                {t("drivers.driverLicenses.noInternationalLicenses")}
              </div>
            ) : (
              <div className="space-y-3">
                {intlLicenses.map((lic) => (
                  <div
                    key={lic.internationalLicenseId}
                    className="rounded-md border p-3 text-sm space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">
                        {t("drivers.driverLicenses.internationalLicenseTitle", {
                          id: lic.internationalLicenseId,
                        })}
                      </span>
                      <div className="flex gap-1">
                        <Badge
                          variant={lic.isActive ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {lic.isActive
                            ? t("drivers.licenseDetails.active")
                            : t("drivers.licenseDetails.inactive")}
                        </Badge>
                        {lic.isDetained && (
                          <Badge variant="destructive" className="text-xs">
                            {t("drivers.licenseDetails.detained")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.issueDate")}
                      </span>
                      <span>{formatDate(lic.issueDate)}</span>
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.expiryDate")}
                      </span>
                      <span>{formatDate(lic.expirationDate)}</span>
                      <span className="text-muted-foreground">
                        {t("drivers.licenseDetails.fees")}
                      </span>
                      <span>${lic.paidFees.toFixed(2)}</span>
                      {lic.localLicenseClass && (
                        <>
                          <span className="text-muted-foreground">
                            {t("drivers.driverLicenses.localLicenseClass")}
                          </span>
                          <span>{lic.localLicenseClass}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
