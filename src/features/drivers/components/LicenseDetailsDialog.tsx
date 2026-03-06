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
import { useGetLicenseByApplicationIdQuery } from "../store/driverApi";
import { DriverLicensesDialog } from "./DriverLicensesDialog";
import { LicenseInfoCard } from "./LicenseInfoCard";

interface LicenseDetailsDialogProps {
  applicationId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseDetailsDialog({
  applicationId,
  open,
  onOpenChange,
}: LicenseDetailsDialogProps) {
  const { t } = useTranslation();
  const [allLicensesOpen, setAllLicensesOpen] = useState(false);

  const { data, isLoading } = useGetLicenseByApplicationIdQuery(applicationId, {
    skip: !open,
  });

  const license = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        size="lg"
        className="max-h-[92vh] flex flex-col gap-0 p-0 overflow-hidden"
      >
        <DialogHeader className="px-6 pt-5 pb-3">
          <DialogTitle className="text-base">
            {t("drivers.licenseDetails.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-1 px-6 pb-4">
          {!license && !isLoading ? (
            <p className="py-16 text-center text-muted-foreground text-sm">
              {t("drivers.licenseDetails.notFound")}
            </p>
          ) : (
            <LicenseInfoCard license={license} isLoading={isLoading} />
          )}
        </div>

        {license && (
          <DialogFooter className="px-6 py-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAllLicensesOpen(true)}
            >
              {t("drivers.licenseDetails.viewAllLicenses")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>

      {license && (
        <DriverLicensesDialog
          driverId={license.driverId}
          driverName={license.fullName}
          open={allLicensesOpen}
          onOpenChange={setAllLicensesOpen}
        />
      )}
    </Dialog>
  );
}
