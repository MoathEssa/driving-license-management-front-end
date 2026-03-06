import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@shared/ui/alert-dialog";
import { useDeletePersonMutation, type IPerson } from "../store/peopleApi";

interface DeletePersonDialogProps {
  person: IPerson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePersonDialog({
  person,
  open,
  onOpenChange,
}: DeletePersonDialogProps) {
  const { t } = useTranslation();
  const [deletePerson, { isLoading }] = useDeletePersonMutation();

  const handleConfirm = async () => {
    if (!person) return;
    const result = await deletePerson(person.personId);
    if ("data" in result) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("people.deletePerson.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("people.deletePerson.description", {
              name: person?.fullName ?? "",
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t("people.deletePerson.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant={"destructive"}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("people.deletePerson.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
