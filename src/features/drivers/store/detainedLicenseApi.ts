import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface IDetainLicensePreview {
  licenseId: number;
  isActive: boolean;
  issueDate: string;
  expirationDate: string;
  licensePaidFees: number;
  licenseNotes: string | null;
  driverId: number;
  personId: number;
  fullName: string;
  nationalNo: string | null;
  imagePath: string | null;
  className: string;
  createdByUsername: string | null;
}

export interface IDetainedLicenseView {
  detainId: number;
  licenseId: number;
  detainDate: string;
  fineFees: number;
  isReleased: boolean;
  releaseDate: string | null;
  releaseApplicationId: number | null;
  driverId: number;
  personId: number;
  fullName: string;
  nationalNo: string | null;
  imagePath: string | null;
  licenseApplicationId: number;
  className: string | null;
  isActive: boolean;
  issueDate: string;
  expirationDate: string;
  licensePaidFees: number;
  createdByUsername: string | null;
  releasedByUsername: string | null;
}

export interface IDetainLicenseRequest {
  fineFees: number;
  notes?: string | null;
}

export interface IDetainLicenseResponse {
  detainId: number;
  licenseId: number;
  detainDate: string;
  fineFees: number;
}

export interface IReleaseLicenseRequest {
  notes?: string | null;
}

export interface IReleaseLicenseResponse {
  detainId: number;
  licenseId: number;
  releaseDate: string;
  releaseApplicationId: number;
}

// ── API ────────────────────────────────────────────────────────────────────

export const detainedLicenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/DetainedLicenses
    getAllDetainedLicenses: builder.query<
      IGenericApiResponse<IDetainedLicenseView[]>,
      void
    >({
      query: () => "DetainedLicenses",
      providesTags: ["DetainedLicense"],
    }),

    // GET /api/Drivers/licenses/{licenseId}/detain-preview
    getDetainPreview: builder.query<
      IGenericApiResponse<IDetainLicensePreview>,
      number
    >({
      query: (licenseId) => `Drivers/licenses/${licenseId}/detain-preview`,
    }),

    // POST /api/Drivers/licenses/{licenseId}/detain
    detainLicense: builder.mutation<
      IGenericApiResponse<IDetainLicenseResponse>,
      { licenseId: number; body: IDetainLicenseRequest }
    >({
      query: ({ licenseId, body }) => ({
        url: `Drivers/licenses/${licenseId}/detain`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["License", "Driver", "DetainedLicense"],
    }),

    // POST /api/DetainedLicenses/{detainId}/release
    releaseLicense: builder.mutation<
      IGenericApiResponse<IReleaseLicenseResponse>,
      { detainId: number; body: IReleaseLicenseRequest }
    >({
      query: ({ detainId, body }) => ({
        url: `DetainedLicenses/${detainId}/release`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["License", "Driver", "DetainedLicense", "Application"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllDetainedLicensesQuery,
  useGetDetainPreviewQuery,
  useDetainLicenseMutation,
  useReleaseLicenseMutation,
} = detainedLicenseApi;
