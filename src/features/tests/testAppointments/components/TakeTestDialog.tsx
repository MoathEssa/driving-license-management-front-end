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
import { Textarea } from "@shared/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@shared/ui/radio-group";
import { useTakeTestMutation } from "../../store/testAppointmentsApi";

interface TakeTestDialogProps {
  appointmentId: number;
  testTypeTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TakeTestDialog({
  appointmentId,
  testTypeTitle,
  open,
  onOpenChange,
}: TakeTestDialogProps) {
  const { t } = useTranslation();
  const [result, setResult] = useState<"pass" | "fail" | null>(null);
  const [notes, setNotes] = useState("");
  const [takeTest, { isLoading }] = useTakeTestMutation();

  const handleClose = () => {
    setResult(null);
    setNotes("");
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    if (result === null) return;
    await takeTest({
      appointmentId,
      body: { testResult: result === "pass", notes: notes || null },
    });
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="3xl">
        <DialogHeader>
          <DialogTitle>
            {t("tests.takeTest.title", { testType: testTypeTitle })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Result */}
          <div className="space-y-2">
            <Label>{t("tests.takeTest.result")}</Label>
            <RadioGroup
              value={result ?? ""}
              onValueChange={(v) => setResult(v as "pass" | "fail")}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pass" id="pass" />
                <Label
                  htmlFor="pass"
                  className="cursor-pointer text-green-600 font-medium"
                >
                  {t("tests.takeTest.pass")}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="fail" id="fail" />
                <Label
                  htmlFor="fail"
                  className="cursor-pointer text-destructive font-medium"
                >
                  {t("tests.takeTest.fail")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("tests.takeTest.notes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("tests.takeTest.notesPlaceholder")}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t("tests.takeTest.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={result === null || isLoading}
          >
            {isLoading ? t("tests.takeTest.saving") : t("tests.takeTest.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
