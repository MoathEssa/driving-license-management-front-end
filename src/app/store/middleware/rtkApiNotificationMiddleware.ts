import { logout } from "@features/auth/store/authSlice";
import {
  isRejectedWithValue,
  isFulfilled,
  type Middleware,
} from "@reduxjs/toolkit";
import { toast } from "sonner";
import { t } from "@/shared/lib/i18n/t";
import type { IGenericApiResponse } from "@/shared/types";

/**
 * RTK Query Middleware for centralized API notification handling
 * Handles all API responses (errors + success) and shows appropriate toasts
 */
export const rtkApiNotificationMiddleware: Middleware =
  (store) => (next) => (action) => {
    // Handle error responses (network errors + HTTP errors)
    if (isRejectedWithValue(action)) {
      const payload = action.payload as {
        status?: number | string;
        data?: IGenericApiResponse<unknown>;
        error?: string;
      };

      const status = payload?.status;

      // Extract error message from IGenericApiResponse structure
      const apiErrorMessage =
        payload?.data?.errors?.[0] || payload?.data?.message || payload?.error;

      // Handle by status code
      switch (status) {
        case "FETCH_ERROR":
          toast.error(t("errors.network"));
          break;

        case "TIMEOUT_ERROR":
          toast.error(t("errors.timeout"));
          break;

        case 400:
          toast.error(apiErrorMessage || t("errors.validationError"));
          break;

        case 401: {
          const endpointName = (
            action.meta as { arg?: { endpointName?: string } }
          )?.arg?.endpointName;
          if (endpointName !== "logout") {
            toast.error(t("errors.unauthorized"));
          }
          store.dispatch(logout({ silent: true }));
          break;
        }

        case 403:
          toast.error(t("errors.forbidden"));
          break;

        case 404:
          toast.error(apiErrorMessage || t("errors.notFound"));
          break;

        case 409:
          toast.error(apiErrorMessage || t("errors.conflict"));
          break;

        case 500:
        case 502:
        case 503:
          toast.error(t("errors.serverError"));
          break;

        default:
          if (apiErrorMessage) {
            toast.error(apiErrorMessage);
          } else {
            toast.error(t("errors.unknown"));
          }
      }
    }

    // Handle successful mutations — show success message from backend
    if (isFulfilled(action)) {
      const payload = action.payload as
        | IGenericApiResponse<unknown>
        | undefined;

      // Only show success toast for mutations (not queries)
      // RTK Query actions have endpointName in meta
      const endpointName = (
        action as { meta?: { arg?: { endpointName?: string; type?: string } } }
      )?.meta?.arg?.endpointName;
      const argType = (action as { meta?: { arg?: { type?: string } } })?.meta
        ?.arg?.type;

      // Only show toast for mutations, not queries
      if (argType === "mutation" && payload?.message && payload?.succeeded) {
        // Silent endpoints: never show a standalone toast (they're always part of a compound operation)
        const silentEndpoints = ["refreshToken", "uploadPersonImage"];
        if (!silentEndpoints.includes(endpointName ?? "")) {
          toast.success(payload.message);
        }
      }
    }

    return next(action);
  };
