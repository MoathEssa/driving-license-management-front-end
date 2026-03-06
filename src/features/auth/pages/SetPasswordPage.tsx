import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";
import { toast } from "sonner";
import {
  Car,
  Shield,
  Eye,
  EyeOff,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
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
import { ThemeToggle } from "@shared/components/layout/ThemeToggle";
import {
  setPasswordSchema,
  setPasswordDefaultValues,
  type TSetPasswordSchema,
} from "../schemas/setPasswordSchema";
import { useSetPasswordMutation } from "../store/authApi";

export function SetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const userId = Number(searchParams.get("userId"));
  const token = searchParams.get("token") ?? "";

  const [setPassword, { isLoading }] = useSetPasswordMutation();

  const form = useForm<TSetPasswordSchema>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: setPasswordDefaultValues,
    mode: "onChange",
  });

  const isValid = userId > 0 && token.length > 0;

  const onSubmit = async (data: TSetPasswordSchema) => {
    if (!isValid) return;
    const result = await setPassword({
      userId,
      token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    if ("data" in result) {
      toast.success(t("auth.setPassword.success"));
      navigate("/auth/sign-in");
    }
  };

  return (
    <div
      dir={dir}
      className="relative flex min-h-screen bg-background overflow-hidden"
    >
      {/* Theme toggle */}
      <div className="absolute top-4 inset-e-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col items-center justify-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/5" />
        <div className="absolute top-1/2 -right-16 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-xs">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20 shadow-xl">
            <Car className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight leading-tight">
              {t("auth.systemName")}
            </h2>
            <p className="mt-3 text-primary-foreground/75 text-sm leading-relaxed">
              {t("auth.systemDescription")}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-primary-foreground/60">
            <Shield className="w-3.5 h-3.5" />
            <span>{t("auth.govLabel")}</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile brand header */}
        <div className="lg:hidden flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary shadow-md">
            <Car className="w-7 h-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground">{t("auth.systemName")}</p>
            <p className="text-xs text-muted-foreground">
              {t("auth.govLabel")}
            </p>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
            {/* Icon + heading */}
            <div className="mb-7 flex flex-col items-center text-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <KeyRound className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {t("auth.setPassword.title")}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {t("auth.setPassword.description")}
                </p>
              </div>
            </div>

            {/* Invalid link state */}
            {!isValid ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <p className="text-sm text-destructive leading-relaxed">
                  {t("auth.setPassword.invalidLink")}
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate("/auth/sign-in")}
                >
                  {t("auth.login.title")}
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.setPassword.passwordLabel")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="pe-10"
                              {...field}
                            />
                            <button
                              type="button"
                              aria-label={
                                showPassword
                                  ? t("auth.setPassword.hidePassword")
                                  : t("auth.setPassword.showPassword")
                              }
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute inset-y-0 inset-e-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
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

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("auth.setPassword.confirmPasswordLabel")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirm ? "text" : "password"}
                              className="pe-10"
                              {...field}
                            />
                            <button
                              type="button"
                              aria-label={
                                showConfirm
                                  ? t("auth.setPassword.hidePassword")
                                  : t("auth.setPassword.showPassword")
                              }
                              onClick={() => setShowConfirm((v) => !v)}
                              className="absolute inset-y-0 inset-e-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                            >
                              {showConfirm ? (
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading
                      ? t("auth.setPassword.submitting")
                      : t("auth.setPassword.submit")}
                  </Button>
                </form>
              </Form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("auth.copyright")}
          </p>
        </div>
      </div>
    </div>
  );
}
