import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ==================== Types ====================

export interface IApplicationType extends Record<string, unknown> {
  applicationTypeId: number;
  applicationTypeTitle: string;
  applicationFees: number;
}

export interface IUpdateApplicationTypeRequest {
  applicationTypeId: number;
  applicationTypeTitle: string;
  applicationFees: number;
}

// ==================== API ====================

export const applicationTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllApplicationTypes: builder.query<
      IGenericApiResponse<IApplicationType[]>,
      void
    >({
      query: () => "Applications/types",
      providesTags: ["ApplicationType"],
    }),

    updateApplicationType: builder.mutation<
      IGenericApiResponse<IApplicationType>,
      IUpdateApplicationTypeRequest
    >({
      query: ({ applicationTypeId, ...body }) => ({
        url: `Applications/types/${applicationTypeId}`,
        method: "PUT",
        body: { applicationTypeId, ...body },
      }),
      invalidatesTags: ["ApplicationType"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllApplicationTypesQuery,
  useUpdateApplicationTypeMutation,
} = applicationTypesApi;
