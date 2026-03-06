import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Car, Shield } from "lucide-react";
import { ThemeToggle } from "@shared/components/layout/ThemeToggle";
import RegisterForm from "../components/register/components/RegisterForm";

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen bg-background overflow-hidden">
      {/* Theme toggle – always visible in top-end corner */}
      <div className="absolute top-4 inset-e-4 z-50">
        <ThemeToggle />
      </div>
      {/* Left branding panel – hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col items-center justify-center bg-primary text-primary-foreground p-12 relative overflow-hidden">
        {/* decorative rings */}
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

      {/* Right register form panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile-only brand header */}
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

        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold text-foreground">
                {t("auth.register.title")}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {t("auth.register.subtitle")}
              </p>
            </div>

            <RegisterForm />

            <div className="mt-6 text-center">
              <span className="text-sm text-muted-foreground">
                {t("auth.register.hasAccount")}{" "}
              </span>
              <Link
                to="/auth/sign-in"
                className="text-sm font-semibold text-primary hover:underline underline-offset-4"
              >
                {t("auth.register.signInLink")}
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("auth.copyright")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
