import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface IRenewLicensePreview {
  licenseId: number;
  applicationId: number;
  isActive: boolean;
  issueReason: number;
  issueDate: string;
  expirationDate: string;
  licenseNotes: string | null;
  licensePaidFees: number;
  driverId: number;
  personId: number;
  fullName: string;
  nationalNo: string | null;
  dateOfBirth: string | null;
  gender: number | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  imagePath: string | null;
  nationality: string | null;
  isDetained: boolean;
  licenseClassId: number;
  className: string;
  classDescription: string | null;
  createdByUsername: string;
  applicationFees: number;
  licenseFees: number;
  totalFees: number;
  newIssueDate: string;
  newExpirationDate: string;
}

export interface IRenewLicenseResponse {
  newLicenseId: number;
  newApplicationId: number;
  oldLicenseId: number;
  newIssueDate: string;
  newExpirationDate: string;
  totalFees: number;
}

export interface IRenewLicenseRequest {
  notes?: string | null;
}

// ── API ────────────────────────────────────────────────────────────────────

export const renewalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Drivers/licenses/{licenseId}/renewal-preview
    getRenewalPreview: builder.query<
      IGenericApiResponse<IRenewLicensePreview>,
      number
    >({
      query: (licenseId) => `Drivers/licenses/${licenseId}/renewal-preview`,
    }),

    // POST /api/Drivers/licenses/{licenseId}/renew
    renewLicense: builder.mutation<
      IGenericApiResponse<IRenewLicenseResponse>,
      { licenseId: number; body: IRenewLicenseRequest }
    >({
      query: ({ licenseId, body }) => ({
        url: `Drivers/licenses/${licenseId}/renew`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["License", "Application", "Driver"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRenewalPreviewQuery, useRenewLicenseMutation } =
  renewalApi;
