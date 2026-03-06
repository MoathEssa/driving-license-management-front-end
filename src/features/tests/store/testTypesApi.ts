import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ==================== Types ====================

export interface ITestType extends Record<string, unknown> {
  testTypeId: number;
  testTypeTitle: string;
  testTypeDescription: string | null;
  testTypeFees: number;
}

export interface IUpdateTestTypeRequest {
  testTypeId: number;
  testTypeTitle: string;
  testTypeDescription?: string | null;
  testTypeFees: number;
}

// ==================== API ====================

export const testTypesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTestTypes: builder.query<IGenericApiResponse<ITestType[]>, void>({
      query: () => "Tests/types",
      providesTags: ["TestType"],
    }),

    updateTestType: builder.mutation<
      IGenericApiResponse<ITestType>,
      IUpdateTestTypeRequest
    >({
      query: ({ testTypeId, ...body }) => ({
        url: `Tests/types/${testTypeId}`,
        method: "PUT",
        body: { testTypeId, ...body },
      }),
      invalidatesTags: ["TestType"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAllTestTypesQuery, useUpdateTestTypeMutation } =
  testTypesApi;
