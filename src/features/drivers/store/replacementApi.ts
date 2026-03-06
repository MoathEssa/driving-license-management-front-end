import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface IReplaceLicensePreview {
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

export interface IReplaceLicenseResponse {
  newLicenseId: number;
  newApplicationId: number;
  oldLicenseId: number;
  newIssueDate: string;
  newExpirationDate: string;
  totalFees: number;
}

export interface IReplaceLicenseRequest {
  reasonType: number; // 1 = Damaged, 2 = Lost
  notes?: string | null;
}

// ── API ────────────────────────────────────────────────────────────────────

export const replacementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Drivers/licenses/{licenseId}/replacement-preview
    getReplacementPreview: builder.query<
      IGenericApiResponse<IReplaceLicensePreview>,
      number
    >({
      query: (licenseId) => `Drivers/licenses/${licenseId}/replacement-preview`,
    }),

    // POST /api/Drivers/licenses/{licenseId}/replace
    replaceLicense: builder.mutation<
      IGenericApiResponse<IReplaceLicenseResponse>,
      { licenseId: number; body: IReplaceLicenseRequest }
    >({
      query: ({ licenseId, body }) => ({
        url: `Drivers/licenses/${licenseId}/replace`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["License", "Application", "Driver"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetReplacementPreviewQuery, useReplaceLicenseMutation } =
  replacementApi;
