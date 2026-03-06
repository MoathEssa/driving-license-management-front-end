import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Textarea } from "@shared/ui/textarea";
import { useSendEmailMutation, type IUser } from "../store/usersApi";

interface SendEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
}

export function SendEmailDialog({
  open,
  onOpenChange,
  user,
}: SendEmailDialogProps) {
  const { t } = useTranslation();
  const [sendEmail, { isLoading }] = useSendEmailMutation();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const recipientName = user?.fullName ?? user?.email ?? "—";

  const handleClose = () => {
    setSubject("");
    setMessage("");
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedSubject || !trimmedMessage) return;

    try {
      await sendEmail({
        userId: user.userId,
        subject: trimmedSubject,
        message: trimmedMessage,
      }).unwrap();

      handleClose();
    } catch {
      toast.error(t("users.sendEmailDialog.errorTitle"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            {t("users.sendEmailDialog.title", { name: recipientName })}
          </DialogTitle>
          <DialogDescription>
            {t("users.sendEmailDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="email-subject">
              {t("users.sendEmailDialog.subjectLabel")}
            </Label>
            <Input
              id="email-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("users.sendEmailDialog.subjectPlaceholder")}
              maxLength={200}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email-message">
              {t("users.sendEmailDialog.messageLabel")}
            </Label>
            <Textarea
              id="email-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("users.sendEmailDialog.messagePlaceholder")}
              rows={6}
              maxLength={2000}
              required
              disabled={isLoading}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-end">
              {message.length} / 2000
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {t("users.toggleActiveDialog.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !subject.trim() || !message.trim()}
            >
              {isLoading
                ? t("users.sendEmailDialog.sending")
                : t("users.sendEmailDialog.send")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
