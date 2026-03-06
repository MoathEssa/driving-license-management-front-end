import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

export interface ICurrentUserProfile {
  userId: number;
  email: string;
  fullName: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<IGenericApiResponse<ICurrentUserProfile>, void>(
      {
        query: () => "Auth/me",
        providesTags: ["User"],
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetMyProfileQuery } = accountApi;
