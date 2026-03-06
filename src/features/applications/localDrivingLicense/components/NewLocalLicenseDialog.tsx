import { useState } from "react";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import { useAppSelector } from "@app/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { Label } from "@shared/ui/label";
import { Input } from "@shared/ui/input";

import {
  PersonLookupTab,
  AddPersonDialog,
  type IPersonWithUserStatus,
} from "@features/people";

import { ApplicationType } from "@shared/constants";
import {
  useGetLicenseClassesQuery,
  useCreateLocalDrivingLicenseApplicationMutation,
} from "../store/localDrivingLicenseApi";
import { useGetAllApplicationTypesQuery } from "../../store/applicationTypesApi";

interface NewLocalLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "personal" | "application";

export function NewLocalLicenseDialog({
  open,
  onOpenChange,
}: NewLocalLicenseDialogProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";
  const authData = useAppSelector((s) => s.auth.authData);

  // ── state ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("personal");
  const [selectedPerson, setSelectedPerson] =
    useState<IPersonWithUserStatus | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [addPersonOpen, setAddPersonOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── queries ────────────────────────────────────────────────────────────
  const { data: classesData, isLoading: classesLoading } =
    useGetLicenseClassesQuery();
  const { data: appTypesData } = useGetAllApplicationTypesQuery();
  const [createApplication, { isLoading: saving }] =
    useCreateLocalDrivingLicenseApplicationMutation();

  const classes = classesData?.data ?? [];
  const selectedClass = classes.find(
    (c) => c.licenseClassId.toString() === selectedClassId,
  );
  const applicationTypeFee = appTypesData?.data?.find(
    (t) => t.applicationTypeId === ApplicationType.NewLocalDrivingLicense,
  )?.applicationFees;

  // ── helpers ────────────────────────────────────────────────────────────
  const resetState = () => {
    setStep("personal");
    setSelectedPerson(null);
    setSelectedClassId("");
    setServerError(null);
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!selectedPerson || !selectedClassId) return;
    setServerError(null);

    const result = await createApplication({
      personId: selectedPerson.personId,
      licenseClassId: parseInt(selectedClassId),
    });

    if ("error" in result) {
      const err = result.error as { data?: { message?: string } };
      setServerError(
        err?.data?.message ??
          t("applications.localDrivingLicense.newDialog.saveError", {
            defaultValue: "Failed to save application.",
          }),
      );
    } else {
      handleClose();
    }
  };

  const today = new Date().toLocaleDateString();
  const createdByName = authData?.user?.fullName ?? "—";

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          dir={dir}
          className="sm:max-w-5xl"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {t("applications.localDrivingLicense.newDialog.title")}
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={step}
            onValueChange={(v) => setStep(v as Step)}
            className="w-full"
          >
            {/* Tab list ─────────────────────────────────────────────── */}
            <TabsList className="w-full">
              <TabsTrigger value="personal" className="flex-1">
                {t(
                  "applications.localDrivingLicense.newDialog.tabs.personalInfo",
                )}
              </TabsTrigger>
              <TabsTrigger
                value="application"
                disabled={!selectedPerson}
                className="flex-1"
              >
                {t(
                  "applications.localDrivingLicense.newDialog.tabs.applicationInfo",
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── Personal Info tab ─────────────────────────────────── */}
            <TabsContent value="personal" className="space-y-4 pt-4">
              {/* Add New Person shortcut */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAddPersonOpen(true)}
                >
                  <UserPlus className="me-2 h-4 w-4" />
                  {t(
                    "applications.localDrivingLicense.newDialog.personLookup.addNewPerson",
                  )}
                </Button>
              </div>

              <PersonLookupTab
                selectedPerson={selectedPerson}
                onPersonSelected={setSelectedPerson}
              />

              {/* Next button */}
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => setStep("application")}
                  disabled={!selectedPerson}
                >
                  {t("applications.localDrivingLicense.newDialog.buttons.next")}
                </Button>
              </div>
            </TabsContent>

            {/* ── Application Info tab ──────────────────────────────── */}
            <TabsContent value="application" className="space-y-5 pt-4">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                {/* Application Date */}
                <div className="space-y-1.5">
                  <Label>
                    {t(
                      "applications.localDrivingLicense.newDialog.applicationInfo.applicationDate",
                    )}
                  </Label>
                  <Input value={today} readOnly className="bg-muted" />
                </div>

                {/* License Class */}
                <div className="space-y-1.5">
                  <Label>
                    {t(
                      "applications.localDrivingLicense.newDialog.applicationInfo.licenseClass",
                    )}
                  </Label>
                  <Select
                    value={selectedClassId}
                    onValueChange={setSelectedClassId}
                    disabled={classesLoading}
                  >
                    <SelectTrigger className="truncate">
                      <SelectValue
                        placeholder={t(
                          "applications.localDrivingLicense.newDialog.applicationInfo.licenseClassPlaceholder",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem
                          key={c.licenseClassId}
                          value={c.licenseClassId.toString()}
                          className="max-w-xs"
                        >
                          <span className="block truncate">
                            {c.className}
                            {c.classDescription
                              ? ` – ${c.classDescription}`
                              : ""}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* License Fees (from selected license class) */}
                <div className="space-y-1.5">
                  <Label>
                    {t(
                      "applications.localDrivingLicense.newDialog.applicationInfo.licenseFees",
                    )}
                  </Label>
                  <Input
                    value={
                      selectedClass
                        ? `$${selectedClass.classFees.toFixed(2)}`
                        : "—"
                    }
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* Application Fees (from application type) */}
                <div className="space-y-1.5">
                  <Label>
                    {t(
                      "applications.localDrivingLicense.newDialog.applicationInfo.applicationFees",
                    )}
                  </Label>
                  <Input
                    value={
                      applicationTypeFee !== undefined
                        ? `$${applicationTypeFee.toFixed(2)}`
                        : "—"
                    }
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* Created By */}
                <div className="space-y-1.5">
                  <Label>
                    {t(
                      "applications.localDrivingLicense.newDialog.applicationInfo.createdBy",
                    )}
                  </Label>
                  <Input value={createdByName} readOnly className="bg-muted" />
                </div>
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-sm text-destructive">{serverError}</p>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("personal")}
                >
                  {t("applications.localDrivingLicense.newDialog.buttons.back")}
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleClose}>
                    {t(
                      "applications.localDrivingLicense.newDialog.buttons.close",
                    )}
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !selectedClassId}
                  >
                    {saving
                      ? t(
                          "applications.localDrivingLicense.newDialog.buttons.saving",
                        )
                      : t(
                          "applications.localDrivingLicense.newDialog.buttons.save",
                        )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Add Person dialog (shortcut from Personal Info tab) */}
      <AddPersonDialog open={addPersonOpen} onOpenChange={setAddPersonOpen} />
    </>
  );
}
