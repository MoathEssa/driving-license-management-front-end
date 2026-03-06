import i18n from "./index";

/**
 * Translation function for non-React code (middleware, hooks, utils)
 *
 * @example
 * import { t } from "@/shared/lib/i18n/t";
 * toast.error(t("errors.network"));
 *
 * @note Use useTranslation() hook in React components instead
 */
export const t = i18n.t.bind(i18n);

export default t;
