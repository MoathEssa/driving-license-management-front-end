import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";

// Simple deep merge helper
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

// Zod translations
import zodEn from "zod-i18n-map/locales/en/zod.json";
import zodArBase from "zod-i18n-map/locales/ar/zod.json";
import zodArOverrides from "./locales/ar/zod-overrides.json";

// Shared translations
import commonEn from "./locales/en/common.json";
import commonAr from "./locales/ar/common.json";

// Feature translations
import { authEn, authAr } from "@features/auth/i18n";
import { peopleEn, peopleAr } from "@features/people/i18n";
import { usersEn, usersAr } from "@features/users/i18n";
import { applicationsEn, applicationsAr } from "@features/applications/i18n";
import { testsEn, testsAr } from "@features/tests/i18n";
import { driversEn, driversAr } from "@features/drivers/i18n";
import { internationalEn, internationalAr } from "@features/international/i18n";
import { dashboardEn, dashboardAr } from "@features/dashboard/i18n";

// Layout translations
import { layoutEn, layoutAr } from "@shared/components/layout/i18n";

// Merge zod overrides
const zodAr = deepMerge(zodArBase, zodArOverrides);

// Merge all translations
const resources = {
  en: {
    translation: {
      ...commonEn,
      ...authEn,
      ...peopleEn,
      ...usersEn,
      ...applicationsEn,
      ...testsEn,
      ...driversEn,
      ...internationalEn,
      ...dashboardEn,
      ...layoutEn,
    },
    zod: zodEn,
  },
  ar: {
    translation: {
      ...commonAr,
      ...authAr,
      ...peopleAr,
      ...usersAr,
      ...applicationsAr,
      ...testsAr,
      ...driversAr,
      ...internationalAr,
      ...dashboardAr,
      ...layoutAr,
    },
    zod: zodAr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Set Zod to use i18n translations for validation messages
z.setErrorMap(zodI18nMap);

export default i18n;
