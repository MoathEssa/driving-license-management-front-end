import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ==================== Types ====================

export interface ILicenseClass {
  licenseClassId: number;
  className: string;
  classDescription: string | null;
  minimumAllowedAge: number;
  defaultValidityLength: number;
  classFees: number;
}

export type ApplicationStatus = 1 | 2 | 3; // New | Cancelled | Completed

export interface ILocalDrivingLicenseApplicationView extends Record<
  string,
  unknown
> {
  localDrivingLicenseApplicationId: number;
  applicationId: number;
  drivingClass: string;
  nationalNo: string | null;
  fullName: string;
  passedTests: number;
  status: ApplicationStatus;
}

export interface ICreateLocalDrivingLicenseApplicationRequest {
  personId: number;
  licenseClassId: number;
}

export interface ICreateLocalDrivingLicenseApplicationResponse {
  applicationId: number;
  localDrivingLicenseApplicationId: number;
  personId: number;
  licenseClassId: number;
  licenseClassName: string;
  paidFees: number;
  applicationDate: string;
  createdByUserName: string;
}

// ==================== API ====================

export const localDrivingLicenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/LicenseClasses
    getLicenseClasses: builder.query<
      IGenericApiResponse<ILicenseClass[]>,
      void
    >({
      query: () => "LicenseClasses",
      providesTags: ["LicenseClass"],
    }),

    // GET /api/LocalDrivingLicenseApplications
    getLocalDrivingLicenseApplications: builder.query<
      IGenericApiResponse<ILocalDrivingLicenseApplicationView[]>,
      void
    >({
      query: () => "LocalDrivingLicenseApplications",
      providesTags: ["LocalDrivingLicenseApplication"],
    }),

    // POST /api/LocalDrivingLicenseApplications
    createLocalDrivingLicenseApplication: builder.mutation<
      IGenericApiResponse<ICreateLocalDrivingLicenseApplicationResponse>,
      ICreateLocalDrivingLicenseApplicationRequest
    >({
      query: (body) => ({
        url: "LocalDrivingLicenseApplications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["LocalDrivingLicenseApplication"],
    }),

    // PUT /api/LocalDrivingLicenseApplications/{id}/cancel
    cancelLocalDrivingLicenseApplication: builder.mutation<
      IGenericApiResponse<boolean>,
      number
    >({
      query: (id) => ({
        url: `LocalDrivingLicenseApplications/${id}/cancel`,
        method: "PUT",
      }),
      invalidatesTags: ["LocalDrivingLicenseApplication"],
    }),
  }),
});

export const {
  useGetLicenseClassesQuery,
  useGetLocalDrivingLicenseApplicationsQuery,
  useCreateLocalDrivingLicenseApplicationMutation,
  useCancelLocalDrivingLicenseApplicationMutation,
} = localDrivingLicenseApi;
