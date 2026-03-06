import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";
import { Link } from "react-router-dom";
import {
  Car,
  Shield,
  KeyRound,
  Mail,
  CheckCircle2,
  ArrowLeft,
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
  forgotPasswordSchema,
  forgotPasswordDefaultValues,
  type TForgotPasswordSchema,
} from "../schemas/forgotPasswordSchema";
import { useForgotPasswordMutation } from "../store/authApi";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const language = useAppSelector((s) => s.language.current);
  const dir = language === "ar" ? "rtl" : "ltr";

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: forgotPasswordDefaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: TForgotPasswordSchema) => {
    const result = await forgotPassword({ email: data.email });
    if ("data" in result) {
      setSubmitted(true);
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
            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center text-center gap-5 py-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 ring-1 ring-green-500/20">
                  <CheckCircle2 className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {t("auth.forgotPassword.successTitle")}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t("auth.forgotPassword.submitted")}
                  </p>
                </div>
                <Link
                  to="/auth/sign-in"
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 mt-2"
                >
                  <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  {t("auth.forgotPassword.backToLogin")}
                </Link>
              </div>
            ) : (
              <>
                {/* Icon + heading */}
                <div className="mb-7 flex flex-col items-center text-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    <KeyRound className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {t("auth.forgotPassword.title")}
                    </h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {t("auth.forgotPassword.description")}
                    </p>
                  </div>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t("auth.forgotPassword.emailLabel")}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="email"
                                placeholder={t(
                                  "auth.forgotPassword.emailPlaceholder",
                                )}
                                className="ps-10"
                                {...field}
                              />
                              <Mail className="absolute inset-y-0 inset-s-3 my-auto h-4 w-4 text-muted-foreground pointer-events-none" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t("auth.forgotPassword.submitting")
                        : t("auth.forgotPassword.submit")}
                    </Button>

                    <div className="text-center">
                      <Link
                        to="/auth/sign-in"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                        {t("auth.forgotPassword.backToLogin")}
                      </Link>
                    </div>
                  </form>
                </Form>
              </>
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
