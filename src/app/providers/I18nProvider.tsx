import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@app/store";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const language = useAppSelector((state) => state.language.current);

  useEffect(() => {
    const dir = language === "ar" ? "rtl" : "ltr";
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [i18n, language]);

  return <>{children}</>;
}
