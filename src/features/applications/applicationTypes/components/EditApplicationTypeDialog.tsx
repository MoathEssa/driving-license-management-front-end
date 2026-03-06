import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import { Input } from "@shared/ui/input";
import { Button } from "@shared/ui/button";
import {
  useUpdateApplicationTypeMutation,
  type IApplicationType,
} from "../../store/applicationTypesApi";
import {
  applicationTypeSchema,
  type TApplicationTypeSchema,
} from "../schemas/applicationTypeSchema";

interface EditApplicationTypeDialogProps {
  applicationType: IApplicationType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditApplicationTypeDialog({
  applicationType,
  open,
  onOpenChange,
}: EditApplicationTypeDialogProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [updateApplicationType, { isLoading }] =
    useUpdateApplicationTypeMutation();

  const form = useForm<TApplicationTypeSchema>({
    resolver: zodResolver(applicationTypeSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (applicationType) {
      form.reset({
        applicationTypeTitle: applicationType.applicationTypeTitle,
        applicationFees: applicationType.applicationFees,
      });
    }
  }, [applicationType, form]);

  const onSubmit = async (data: TApplicationTypeSchema) => {
    if (!applicationType) return;
    const result = await updateApplicationType({
      applicationTypeId: applicationType.applicationTypeId,
      applicationTypeTitle: data.applicationTypeTitle,
      applicationFees: data.applicationFees,
    });
    if ("data" in result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir} size="md">
        <DialogHeader>
          <DialogTitle>
            {t("applications.applicationTypes.editDialog.title")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="applicationTypeTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("applications.applicationTypes.editDialog.titleLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "applications.applicationTypes.editDialog.titlePlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applicationFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("applications.applicationTypes.editDialog.feesLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder={t(
                        "applications.applicationTypes.editDialog.feesPlaceholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("applications.applicationTypes.editDialog.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("applications.applicationTypes.editDialog.saving")
                  : t("applications.applicationTypes.editDialog.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
