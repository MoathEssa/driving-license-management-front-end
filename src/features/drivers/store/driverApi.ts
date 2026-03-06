import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ── Driver ─────────────────────────────────────────────────────────────────
export interface IDriver {
  driverId: number;
  personId: number;
  fullName: string;
  nationalNo: string | null;
  dateOfBirth: string | null;
  gender: number | null;
  imagePath: string | null;
  createdDate: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  nationality: string | null;
}

// ── License list item (per driver) ─────────────────────────────────────────
export interface IDriverLicense {
  licenseId: number;
  className: string;
  issueDate: string;
  expirationDate: string;
  isActive: boolean;
  issueReason: number;
  isDetained: boolean;
  notes: string | null;
  paidFees: number;
}

// ── Full license details (mapped from vw_LicenseDetails view) ────────────
export interface ILicenseDetails {
  // License
  licenseId: number;
  applicationId: number;
  isActive: boolean;
  issueReason: number;
  issueDate: string;
  expirationDate: string;
  notes: string | null;
  paidFees: number;
  // Driver
  driverId: number;
  driverSince: string;
  // Person
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
  // License class
  className: string;
  classDescription: string | null;
  // Status
  isDetained: boolean;
  // Audit
  createdByUsername: string;
}

// ── Issue License ──────────────────────────────────────────────────────────
export interface IIssueLicenseRequest {
  notes?: string | null;
}

export interface IIssueLicenseResponse {
  licenseId: number;
  applicationId: number;
  driverId: number;
  licenseClassId: number;
  className: string;
  issueDate: string;
  expirationDate: string;
  notes: string | null;
}

// ── API ────────────────────────────────────────────────────────────────────
export const driverApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/Drivers
    getAllDrivers: builder.query<IGenericApiResponse<IDriver[]>, void>({
      query: () => "Drivers",
      providesTags: ["Driver"],
    }),

    // GET /api/Drivers/{id}/licenses
    getDriverLicenses: builder.query<
      IGenericApiResponse<IDriverLicense[]>,
      number
    >({
      query: (driverId) => `Drivers/${driverId}/licenses`,
      providesTags: (_r, _e, id) => [{ type: "Driver", id }],
    }),

    // GET /api/Drivers/licenses/{licenseId}
    getLicenseById: builder.query<IGenericApiResponse<ILicenseDetails>, number>(
      {
        query: (licenseId) => `Drivers/licenses/${licenseId}`,
        providesTags: (_r, _e, id) => [{ type: "License", id }],
      },
    ),

    // GET /api/Drivers/licenses/by-application/{applicationId}
    getLicenseByApplicationId: builder.query<
      IGenericApiResponse<ILicenseDetails>,
      number
    >({
      query: (applicationId) =>
        `Drivers/licenses/by-application/${applicationId}`,
      providesTags: (_r, _e, id) => [{ type: "License", id }],
    }),

    // GET /api/Drivers/licenses/by-person/{personId}
    getLicensesByPersonId: builder.query<
      IGenericApiResponse<IDriverLicense[]>,
      number
    >({
      query: (personId) => `Drivers/licenses/by-person/${personId}`,
      providesTags: (_r, _e, id) => [{ type: "License", id }],
    }),

    // POST /api/Drivers/{ldlaId}/issue-license
    issueLicenseFirstTime: builder.mutation<
      IGenericApiResponse<IIssueLicenseResponse>,
      { ldlaId: number; body: IIssueLicenseRequest }
    >({
      query: ({ ldlaId, body }) => ({
        url: `Drivers/${ldlaId}/issue-license`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "License",
        "LocalDrivingLicenseApplication",
        "Application",
        "Driver",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllDriversQuery,
  useGetDriverLicensesQuery,
  useGetLicenseByIdQuery,
  useLazyGetLicenseByIdQuery,
  useGetLicenseByApplicationIdQuery,
  useGetLicensesByPersonIdQuery,
  useIssueLicenseFirstTimeMutation,
} = driverApi;
