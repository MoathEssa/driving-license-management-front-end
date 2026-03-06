import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRegisterMutation } from "@features/auth/store/authApi";
import { setCredentials } from "@features/auth/store/authSlice";
import { useAppDispatch, useAppSelector } from "@app/store";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
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
import { Gender, getGenderI18nKey } from "@shared/types";
import {
  registerFormSchema,
  registerFormSchemaDefaultValues,
  type TRegisterFormSchema,
} from "../schemas/registerSchema";

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";
  const [triggerRegister, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<TRegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: registerFormSchemaDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: TRegisterFormSchema) => {
    const response = await triggerRegister({
      nationalNo: data.nationalNo,
      firstName: data.firstName,
      secondName: data.secondName,
      thirdName: data.thirdName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: Number(data.gender),
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

    if ("data" in response && response.data?.data) {
      dispatch(setCredentials(response.data.data));
      navigate("/", { replace: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* National Number */}
        <FormField
          control={form.control}
          name="nationalNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.nationalNoLabel")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.register.nationalNoPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name row 1: First + Second */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.firstNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.firstNamePlaceholder")}
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
                <FormLabel>{t("auth.register.secondNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.secondNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Name row 2: Third + Last */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="thirdName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.thirdNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.thirdNamePlaceholder")}
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
                <FormLabel>{t("auth.register.lastNameLabel")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("auth.register.lastNamePlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DOB + Gender */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.register.dateOfBirthLabel")}</FormLabel>
                <FormControl>
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("auth.register.dateOfBirthLabel")}
                    fromYear={1920}
                    toYear={new Date().getFullYear() - 16}
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
                <FormLabel>{t("auth.register.genderLabel")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  dir={dir}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={t("auth.register.genderLabel")}
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

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.emailLabel")}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder={t("auth.register.emailPlaceholder")}
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.passwordLabel")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.register.passwordPlaceholder")}
                    autoComplete="new-password"
                    className="pe-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 inset-e-0 flex items-center pe-3 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.register.confirmPasswordLabel")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("auth.register.confirmPasswordPlaceholder")}
                    autoComplete="new-password"
                    className="pe-10"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {isLoading
            ? t("auth.register.registering")
            : t("auth.register.submitButton")}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
