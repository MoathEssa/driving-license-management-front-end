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
import { Textarea } from "@shared/ui/textarea";
import { Button } from "@shared/ui/button";
import {
  useUpdateTestTypeMutation,
  type ITestType,
} from "../../store/testTypesApi";
import {
  testTypeSchema,
  type TTestTypeSchema,
} from "../schemas/testTypeSchema";

interface EditTestTypeDialogProps {
  testType: ITestType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTestTypeDialog({
  testType,
  open,
  onOpenChange,
}: EditTestTypeDialogProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [updateTestType, { isLoading }] = useUpdateTestTypeMutation();

  const form = useForm<TTestTypeSchema>({
    resolver: zodResolver(testTypeSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (testType) {
      form.reset({
        testTypeTitle: testType.testTypeTitle,
        testTypeDescription: testType.testTypeDescription ?? "",
        testTypeFees: testType.testTypeFees,
      });
    }
  }, [testType, form]);

  const onSubmit = async (data: TTestTypeSchema) => {
    if (!testType) return;
    const result = await updateTestType({
      testTypeId: testType.testTypeId,
      testTypeTitle: data.testTypeTitle,
      testTypeDescription: data.testTypeDescription || null,
      testTypeFees: data.testTypeFees,
    });
    if ("data" in result) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir} size="md">
        <DialogHeader>
          <DialogTitle>{t("tests.testTypes.editDialog.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="testTypeTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("tests.testTypes.editDialog.titleLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "tests.testTypes.editDialog.titlePlaceholder",
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
              name="testTypeDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("tests.testTypes.editDialog.descriptionLabel")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "tests.testTypes.editDialog.descriptionPlaceholder",
                      )}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testTypeFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("tests.testTypes.editDialog.feesLabel")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      placeholder={t(
                        "tests.testTypes.editDialog.feesPlaceholder",
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
                {t("tests.testTypes.editDialog.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("tests.testTypes.editDialog.saving")
                  : t("tests.testTypes.editDialog.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
