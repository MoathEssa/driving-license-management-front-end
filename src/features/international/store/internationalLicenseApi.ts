import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";
import type { ILicenseDetails } from "@features/drivers";

// ── View (manage page) ──────────────────────────────────────────────────────
export interface IInternationalLicenseView {
  internationalLicenseId: number;
  applicationId: number;
  localLicenseId: number;
  localApplicationId: number;
  issueDate: string;
  expirationDate: string;
  isActive: boolean;
  paidFees: number;
  driverId: number;
  fullName: string;
  nationalNo: string | null;
  imagePath: string | null;
  localLicenseClass: string | null;
  isDetained: boolean;
  createdByUsername: string | null;
}

// ── Issue Response ──────────────────────────────────────────────────────────
export interface IIssueInternationalLicenseResponse {
  internationalLicenseId: number;
  applicationId: number;
  localLicenseId: number;
  driverFullName: string;
  issueDate: string;
  expirationDate: string;
  paidFees: number;
  isActive: boolean;
}

// ── API ─────────────────────────────────────────────────────────────────────
export const internationalLicenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/InternationalLicenses
    getAllInternationalLicenses: builder.query<
      IGenericApiResponse<IInternationalLicenseView[]>,
      void
    >({
      query: () => `InternationalLicenses`,
      providesTags: ["Driver", "License"],
    }),

    // GET /api/InternationalLicenses/license/{localLicenseId}/validate
    validateLicenseForInternational: builder.query<
      IGenericApiResponse<ILicenseDetails>,
      number
    >({
      query: (localLicenseId) =>
        `InternationalLicenses/license/${localLicenseId}/validate`,
    }),

    // POST /api/InternationalLicenses/license/{localLicenseId}/issue
    issueInternationalLicense: builder.mutation<
      IGenericApiResponse<IIssueInternationalLicenseResponse>,
      number
    >({
      query: (localLicenseId) => ({
        url: `InternationalLicenses/license/${localLicenseId}/issue`,
        method: "POST",
      }),
      invalidatesTags: ["Driver", "License"],
    }),

    // GET /api/InternationalLicenses/driver/{driverId}
    getInternationalLicensesByDriverId: builder.query<
      IGenericApiResponse<IInternationalLicenseView[]>,
      number
    >({
      query: (driverId) => `InternationalLicenses/driver/${driverId}`,
      providesTags: (_r, _e, id) => [{ type: "Driver", id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllInternationalLicensesQuery,
  useLazyValidateLicenseForInternationalQuery,
  useIssueInternationalLicenseMutation,
  useGetInternationalLicensesByDriverIdQuery,
} = internationalLicenseApi;
