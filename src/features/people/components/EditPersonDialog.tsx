import { useEffect, useState } from "react";
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
  useUpdatePersonMutation,
  useUploadPersonImageMutation,
  type IPerson,
} from "../store/peopleApi";
import {
  personFormSchema,
  type TPersonFormSchema,
} from "../schemas/personSchema";

interface EditPersonDialogProps {
  person: IPerson | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPersonDialog({
  person,
  open,
  onOpenChange,
}: EditPersonDialogProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [updatePerson, { isLoading }] = useUpdatePersonMutation();
  const [uploadImage] = useUploadPersonImageMutation();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const form = useForm<TPersonFormSchema>({
    resolver: zodResolver(personFormSchema),
    mode: "onChange",
  });

  // Pre-fill form when person changes
  useEffect(() => {
    if (person) {
      form.reset({
        nationalNo: person.nationalNo ?? "",
        firstName: person.firstName,
        secondName: person.secondName ?? "",
        thirdName: person.thirdName ?? "",
        lastName: person.lastName,
        dateOfBirth: person.dateOfBirth ?? "",
        gender:
          person.gender !== null && person.gender !== undefined
            ? String(person.gender)
            : "",
        email: person.email ?? "",
        phone: person.phone ?? "",
        address: person.address ?? "",
      });
    }
  }, [person, form]);

  const onSubmit = async (data: TPersonFormSchema) => {
    if (!person) return;

    const result = await updatePerson({
      personId: person.personId,
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
      setPhotoFile(null);
      onOpenChange(false);
      // Upload image in the background — does not block the dialog or the success toast
      if (photoFile) {
        uploadImage({ id: person.personId, image: photoFile });
      }
    }
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setPhotoFile(null);
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir={dir}
        size="full"
        className="max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {t("people.editPerson.title", {
              name: person?.fullName ?? "",
            })}
          </DialogTitle>
        </DialogHeader>
        <PersonForm
          form={form}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isLoading={isLoading}
          submitLabel={t("people.editPerson.submit")}
          currentImagePath={person?.imagePath ?? null}
          onPhotoChange={setPhotoFile}
        />
      </DialogContent>
    </Dialog>
  );
}
