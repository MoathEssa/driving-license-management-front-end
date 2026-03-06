import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ==================== Types ====================

export interface IUser extends Record<string, unknown> {
  userId: number;
  personId: number;
  email: string;
  role: string;
  fullName?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateUserRequest {
  personId: number;
  email: string;
  role?: string;
}

export interface ICreateUserResponse {
  userId: number;
  email: string;
  fullName: string;
  message: string;
}

export interface ISendEmailRequest {
  userId: number;
  subject: string;
  message: string;
}

export interface ISetUserActiveRequest {
  userId: number;
  isActive: boolean;
}

// ==================== API ====================

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<IGenericApiResponse<IUser[]>, void>({
      query: () => "Users",
      providesTags: ["User"],
    }),

    createUser: builder.mutation<
      IGenericApiResponse<ICreateUserResponse>,
      ICreateUserRequest
    >({
      query: (body) => ({ url: "Users", method: "POST", body }),
      invalidatesTags: ["User", "Person"],
    }),

    resendInvitation: builder.mutation<IGenericApiResponse<string>, number>({
      query: (userId) => ({
        url: `Users/${userId}/resend-invitation`,
        method: "POST",
      }),
    }),

    sendEmail: builder.mutation<IGenericApiResponse<string>, ISendEmailRequest>({
      query: ({ userId, subject, message }) => ({
        url: `Users/${userId}/send-email`,
        method: "POST",
        body: { subject, message },
      }),
    }),

    setUserActive: builder.mutation<IGenericApiResponse<string>, ISetUserActiveRequest>({
      query: ({ userId, isActive }) => ({
        url: `Users/${userId}/set-active`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useResendInvitationMutation,
  useSendEmailMutation,
  useSetUserActiveMutation,
} = usersApi;
