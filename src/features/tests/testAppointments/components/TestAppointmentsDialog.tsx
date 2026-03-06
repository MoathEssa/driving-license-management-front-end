import { useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { CalendarCheck, ClipboardEdit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { Separator } from "@shared/ui/separator";
import {
  useGetLdlaDetailsQuery,
  useGetTestAppointmentsByTypeQuery,
} from "../../store/testAppointmentsApi";
import { useGetAllTestTypesQuery } from "../../store/testTypesApi";
import { ScheduleTestDialog } from "./ScheduleTestDialog";
import { TakeTestDialog } from "./TakeTestDialog";

interface TestAppointmentsDialogProps {
  applicationId: number;
  testTypeId: 1 | 2 | 3;
  testTypeTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestAppointmentsDialog({
  applicationId,
  testTypeId,
  testTypeTitle,
  open,
  onOpenChange,
}: TestAppointmentsDialogProps) {
  const { t } = useTranslation();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [takeTestAppointmentId, setTakeTestAppointmentId] = useState<
    number | null
  >(null);

  const { data: detailsData, isLoading: detailsLoading } =
    useGetLdlaDetailsQuery(applicationId, { skip: !open });

  const ldla = detailsData?.data;

  const { data: appointmentsData, isLoading: apptLoading } =
    useGetTestAppointmentsByTypeQuery(
      { ldlaId: ldla?.localDrivingLicenseApplicationId ?? 0, testTypeId },
      { skip: !open || !ldla },
    );

  const { data: testTypesData } = useGetAllTestTypesQuery(undefined, {
    skip: !open,
  });

  const appointments = appointmentsData?.data ?? [];
  const testType = testTypesData?.data?.find(
    (tt) => tt.testTypeId === testTypeId,
  );

  // Determine button states
  const hasPassed = appointments.some(
    (a) => a.isLocked && a.testResult === true,
  );
  const hasActiveUnlocked = appointments.some(
    (a) => !a.isLocked && a.testResult === null,
  );
  const canSchedule =
    !hasPassed && !hasActiveUnlocked && ldla?.applicationStatus === 1;

  const trialNumber = appointments.length + 1;

  const isLoading = detailsLoading || apptLoading;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size="2xl">
          <DialogHeader>
            <DialogTitle>
              {t("tests.appointments.dialog.title", {
                testType: testTypeTitle,
              })}
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              Loading…
            </div>
          ) : ldla ? (
            <>
              {/* LDLA Info */}
              <div className="rounded-md border bg-muted/40 p-3 text-sm grid grid-cols-3 gap-2">
                <div>
                  <p className="text-muted-foreground text-xs">
                    {t("tests.appointments.dialog.ldlaId")}
                  </p>
                  <p className="font-medium">{ldla.applicationId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    {t("tests.appointments.dialog.class")}
                  </p>
                  <p className="font-medium">{ldla.className}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    {t("tests.appointments.dialog.name")}
                  </p>
                  <p className="font-medium">{ldla.fullName}</p>
                </div>
              </div>

              <Separator />

              {/* Appointments Table */}
              <div className="overflow-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-start font-medium">
                        {t("tests.appointments.table.trial")}
                      </th>
                      <th className="px-3 py-2 text-start font-medium">
                        {t("tests.appointments.table.date")}
                      </th>
                      <th className="px-3 py-2 text-end font-medium">
                        {t("tests.appointments.table.fees")}
                      </th>
                      <th className="px-3 py-2 text-center font-medium">
                        {t("tests.appointments.table.result")}
                      </th>
                      <th className="px-3 py-2 text-start font-medium">
                        {t("tests.appointments.table.notes")}
                      </th>
                      <th className="px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-3 py-4 text-center text-muted-foreground"
                        >
                          {t("tests.appointments.table.noResults")}
                        </td>
                      </tr>
                    ) : (
                      appointments.map((appt, idx) => (
                        <tr
                          key={appt.testAppointmentId}
                          className="border-t hover:bg-muted/20"
                        >
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2">
                            {format(
                              new Date(appt.appointmentDate),
                              "dd/MM/yyyy",
                            )}
                          </td>
                          <td className="px-3 py-2 text-end">
                            {appt.paidFees.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {appt.testResult === null ? (
                              <Badge variant="outline">
                                {t("tests.appointments.results.pending")}
                              </Badge>
                            ) : appt.testResult ? (
                              <Badge className="bg-green-500/15 text-green-700 border-green-500/30">
                                {t("tests.appointments.results.pass")}
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                {t("tests.appointments.results.fail")}
                              </Badge>
                            )}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground max-w-[160px] truncate">
                            {appt.testNotes ?? "—"}
                          </td>
                          <td className="px-3 py-2 text-end">
                            {!appt.isLocked && appt.testResult === null && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setTakeTestAppointmentId(
                                    appt.testAppointmentId,
                                  )
                                }
                              >
                                <ClipboardEdit className="me-1.5 h-3.5 w-3.5" />
                                {t("tests.appointments.table.actions")}
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("tests.appointments.dialog.closeBtn")}
            </Button>
            {canSchedule && (
              <Button onClick={() => setScheduleOpen(true)}>
                <CalendarCheck className="me-2 h-4 w-4" />
                {t("tests.appointments.dialog.scheduleBtn")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule sub-dialog */}
      {ldla && (
        <ScheduleTestDialog
          ldlaId={ldla.localDrivingLicenseApplicationId}
          applicationId={ldla.applicationId}
          className={ldla.className}
          fullName={ldla.fullName}
          testTypeId={testTypeId}
          testTypeTitle={testTypeTitle}
          testTypeFees={testType?.testTypeFees ?? 0}
          trialNumber={trialNumber}
          open={scheduleOpen}
          onOpenChange={setScheduleOpen}
        />
      )}

      {/* Take Test sub-dialog */}
      <TakeTestDialog
        appointmentId={takeTestAppointmentId ?? 0}
        testTypeTitle={testTypeTitle}
        open={takeTestAppointmentId !== null}
        onOpenChange={(o) => {
          if (!o) setTakeTestAppointmentId(null);
        }}
      />
    </>
  );
}
