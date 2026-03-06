import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui/select";
import { DatePicker } from "@shared/ui/date-picker";
import { Loader2, User, Camera } from "lucide-react";
import { Gender, getGenderI18nKey } from "@shared/types";
import type { UseFormReturn } from "react-hook-form";
import type { TPersonFormSchema } from "../schemas/personSchema";

interface PersonFormProps {
  form: UseFormReturn<TPersonFormSchema>;
  onSubmit: (data: TPersonFormSchema) => void;
  onCancel?: () => void;
  isLoading: boolean;
  submitLabel: string;
  currentImagePath?: string | null;
  onPhotoChange?: (file: File | null) => void;
}

export function PersonForm({
  form,
  onSubmit,
  onCancel,
  isLoading,
  submitLabel,
  currentImagePath,
  onPhotoChange,
}: PersonFormProps) {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    currentImagePath ?? null,
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
      onPhotoChange?.(file);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        dir={dir}
      >
        {/* Top section: left fields + right photo */}
        <div className="grid grid-cols-3 gap-4 items-start">
          {/* Left: National No + Names (2/3 width) */}
          <div className="col-span-2 space-y-4">
            {/* National Number */}
            <FormField
              control={form.control}
              name="nationalNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("people.form.nationalNo")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("people.form.nationalNoPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First + Second */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("people.form.firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("people.form.firstNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="secondName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("people.form.secondName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("people.form.secondNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Third + Last */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="thirdName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("people.form.thirdName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("people.form.thirdNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("people.form.lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("people.form.lastNamePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right: Photo upload (1/3 width) */}
          <div className="flex flex-col items-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-28 h-28 rounded-full border-2 border-dashed border-input bg-muted cursor-pointer overflow-hidden hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Person"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-1 text-muted-foreground group-hover:text-primary transition-colors">
                  <User className="h-10 w-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <Label
              className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview
                ? t("people.form.changePhoto")
                : t("people.form.uploadPhoto")}
            </Label>
          </div>
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("people.form.dateOfBirth")}</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("people.form.dateOfBirthPlaceholder")}
                    fromYear={1920}
                    toYear={new Date().getFullYear() - 1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("people.form.gender")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  dir={dir}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("people.form.genderPlaceholder")}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={String(Gender.Male)}>
                      {t(getGenderI18nKey(Gender.Male))}
                    </SelectItem>
                    <SelectItem value={String(Gender.Female)}>
                      {t(getGenderI18nKey(Gender.Female))}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("people.form.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("people.form.emailPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("people.form.phone")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("people.form.phonePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("people.form.address")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("people.form.addressPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 justify-end pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              onClick={onCancel}
            >
              {t("common.cancel")}
            </Button>
          )}
          <Button type="submit" disabled={isLoading }>
            {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
