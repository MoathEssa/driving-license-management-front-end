import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ── LDLA details (used by test & license dialogs) ──────────────────────────
export interface ILdlaDetails {
  localDrivingLicenseApplicationId: number;
  applicationId: number;
  className: string;
  fullName: string;
  applicationStatus: number;
  passedTests: number;
}

// ── Test Appointment types ─────────────────────────────────────────────────
export interface ITestAppointment {
  testAppointmentId: number;
  appointmentDate: string; // ISO datetime
  paidFees: number;
  isLocked: boolean;
  retakeTestApplicationId: number | null;
  testResult: boolean | null;
  testNotes: string | null;
}

export interface IScheduleTestAppointmentRequest {
  testTypeId: number;
  appointmentDate: string; // ISO datetime "YYYY-MM-DDTHH:mm:ss"
}

export interface IScheduleTestAppointmentResponse {
  testAppointmentId: number;
  testTypeId: number;
  localDrivingLicenseApplicationId: number;
  appointmentDate: string;
  paidFees: number;
  retakeTestApplicationId: number | null;
  retakeTestApplicationFees: number | null;
}

export interface ITakeTestRequest {
  testResult: boolean;
  notes?: string | null;
}

export interface ITakeTestResponse {
  testId: number;
  testAppointmentId: number;
  testResult: boolean;
  notes: string | null;
}

// ── API ────────────────────────────────────────────────────────────────────
export const testAppointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/LocalDrivingLicenseApplications/{applicationId}/details
    getLdlaDetails: builder.query<IGenericApiResponse<ILdlaDetails>, number>({
      query: (applicationId) =>
        `LocalDrivingLicenseApplications/${applicationId}/details`,
      providesTags: (_r, _e, id) => [
        { type: "LocalDrivingLicenseApplication", id },
      ],
    }),

    // GET /api/Tests/{ldlaId}/appointments/{testTypeId}
    getTestAppointmentsByType: builder.query<
      IGenericApiResponse<ITestAppointment[]>,
      { ldlaId: number; testTypeId: number }
    >({
      query: ({ ldlaId, testTypeId }) =>
        `Tests/${ldlaId}/appointments/${testTypeId}`,
      providesTags: ["TestAppointment"],
    }),

    // POST /api/Tests/{ldlaId}/appointments
    scheduleTestAppointment: builder.mutation<
      IGenericApiResponse<IScheduleTestAppointmentResponse>,
      { ldlaId: number; body: IScheduleTestAppointmentRequest }
    >({
      query: ({ ldlaId, body }) => ({
        url: `Tests/${ldlaId}/appointments`,
        method: "POST",
        body,
      }),
      invalidatesTags: [
        "TestAppointment",
        "LocalDrivingLicenseApplication",
        "Application",
      ],
    }),

    // PUT /api/Tests/appointments/{appointmentId}/result
    takeTest: builder.mutation<
      IGenericApiResponse<ITakeTestResponse>,
      { appointmentId: number; body: ITakeTestRequest }
    >({
      query: ({ appointmentId, body }) => ({
        url: `Tests/appointments/${appointmentId}/result`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [
        "TestAppointment",
        "Test",
        "LocalDrivingLicenseApplication",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLdlaDetailsQuery,
  useGetTestAppointmentsByTypeQuery,
  useScheduleTestAppointmentMutation,
  useTakeTestMutation,
} = testAppointmentsApi;
