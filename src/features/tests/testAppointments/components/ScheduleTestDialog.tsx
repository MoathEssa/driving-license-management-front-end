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
import { DatePicker } from "@shared/ui/date-picker";
import { Separator } from "@shared/ui/separator";
import { useScheduleTestAppointmentMutation } from "../../store/testAppointmentsApi";

interface ScheduleTestDialogProps {
  ldlaId: number;
  applicationId: number;
  className: string;
  fullName: string;
  testTypeId: number;
  testTypeTitle: string;
  testTypeFees: number;
  trialNumber: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleTestDialog({
  ldlaId,
  applicationId,
  className,
  fullName,
  testTypeId,
  testTypeTitle,
  testTypeFees,
  trialNumber,
  open,
  onOpenChange,
}: ScheduleTestDialogProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<string>("");
  const [schedule, { isLoading }] = useScheduleTestAppointmentMutation();

  const handleClose = () => {
    setDate("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (!date) return;
    await schedule({
      ldlaId,
      body: {
        testTypeId,
        appointmentDate: `${date}T00:00:00`,
      },
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>
            {t("tests.schedule.title", { testType: testTypeTitle })}
          </DialogTitle>
        </DialogHeader>

        {/* LDLA Info */}
        <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("tests.appointments.dialog.ldlaId")}
            </span>
            <span className="font-medium">{applicationId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("tests.appointments.dialog.class")}
            </span>
            <span className="font-medium">{className}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              {t("tests.appointments.dialog.name")}
            </span>
            <span className="font-medium">{fullName}</span>
          </div>
        </div>

        <Separator />

        {/* Form */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t("tests.schedule.trial")}
            </span>
            <span className="font-medium">{trialNumber}</span>
          </div>

          <div className="space-y-2">
            <Label>{t("tests.schedule.date")}</Label>
            <DatePicker
              value={date}
              onChange={setDate}
              placeholder={t("tests.schedule.datePlaceholder")}
              fromYear={new Date().getFullYear()}
              toYear={new Date().getFullYear() + 2}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {t("tests.schedule.fees")}
            </span>
            <span className="font-semibold">{testTypeFees.toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("tests.schedule.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!date || isLoading}>
            {isLoading ? t("tests.schedule.saving") : t("tests.schedule.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
