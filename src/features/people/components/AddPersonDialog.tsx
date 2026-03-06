import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui/dialog";
import { PersonForm } from "./PersonForm";
import {
  useCreatePersonMutation,
  useUploadPersonImageMutation,
} from "../store/peopleApi";
import {
  personFormSchema,
  personFormDefaultValues,
  type TPersonFormSchema,
} from "../schemas/personSchema";

interface AddPersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPersonDialog({ open, onOpenChange }: AddPersonDialogProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [createPerson, { isLoading }] = useCreatePersonMutation();
  const [uploadImage] = useUploadPersonImageMutation();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<TPersonFormSchema>({
    resolver: zodResolver(personFormSchema),
    defaultValues: personFormDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: TPersonFormSchema) => {
    const result = await createPerson({
      nationalNo: data.nationalNo,
      firstName: data.firstName,
      secondName: data.secondName || null,
      thirdName: data.thirdName || null,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender ? Number(data.gender) : null,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
    });

    if ("data" in result) {
      const person = result.data?.data;
      form.reset();
      setPhotoFile(null);
      onOpenChange(false);
      // Upload image in the background — does not block the dialog or the success toast
      if (photoFile && person) {
        uploadImage({ id: person.personId, image: photoFile });
      }
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) {
      form.reset();
      setPhotoFile(null);
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir={dir}
        className="max-h-[90vh] overflow-y-auto w-full max-w-7xl sm:max-w-6xl"
      >
        <DialogHeader>
          <DialogTitle>{t("people.addPerson.title")}</DialogTitle>
        </DialogHeader>
        <PersonForm
          form={form}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          submitLabel={t("people.addPerson.submit")}
          onPhotoChange={setPhotoFile}
        />
      </DialogContent>
    </Dialog>
  );
}
