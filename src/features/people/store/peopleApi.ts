import { baseApi } from "@shared/api";
import type { IGenericApiResponse } from "@shared/types";

// ==================== Types ====================

export interface IPerson extends Record<string, unknown> {
  personId: number;
  nationalNo: string | null;
  firstName: string;
  secondName: string | null;
  thirdName: string | null;
  lastName: string;
  fullName: string;
  dateOfBirth: string | null; // "YYYY-MM-DD"
  gender: number | null; // 1=Male, 2=Female
  email: string | null;
  phone: string | null;
  address: string | null;
  nationalityCountryId: number | null;
  imagePath: string | null;
}

export interface ICreatePersonRequest {
  nationalNo: string;
  firstName: string;
  secondName?: string | null;
  thirdName?: string | null;
  lastName: string;
  dateOfBirth?: string | null;
  gender?: number | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationalityCountryId?: number | null;
}

export interface IUpdatePersonRequest extends ICreatePersonRequest {
  personId: number;
}

export interface IPersonWithUserStatus extends IPerson {
  hasUser: boolean;
  userId: number | null;
}

// ==================== API ====================

export const peopleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPersons: builder.query<IGenericApiResponse<IPerson[]>, void>({
      query: () => "People",
      providesTags: ["Person"],
    }),
    getPersonById: builder.query<IGenericApiResponse<IPerson>, number>({
      query: (id) => `People/${id}`,
      providesTags: (_result, _err, id) => [{ type: "Person", id }],
    }),
    getPersonByNationalNo: builder.query<
      IGenericApiResponse<IPersonWithUserStatus>,
      string
    >({
      query: (nationalNo) => `People/by-national-no/${nationalNo}`,
      providesTags: (_result, _err, nationalNo) => [
        { type: "Person", id: nationalNo },
      ],
    }),
    createPerson: builder.mutation<
      IGenericApiResponse<IPerson>,
      ICreatePersonRequest
    >({
      query: (body) => ({ url: "People", method: "POST", body }),
      invalidatesTags: ["Person"],
    }),
    updatePerson: builder.mutation<
      IGenericApiResponse<IPerson>,
      IUpdatePersonRequest
    >({
      query: ({ personId, ...body }) => ({
        url: `People/${personId}`,
        method: "PUT",
        body: { personId, ...body },
      }),
      invalidatesTags: (_result, _err, { personId }) => [
        "Person",
        { type: "Person", id: personId },
      ],
    }),
    deletePerson: builder.mutation<IGenericApiResponse<null>, number>({
      query: (id) => ({ url: `People/${id}`, method: "DELETE" }),
      invalidatesTags: ["Person"],
    }),
    uploadPersonImage: builder.mutation<
      IGenericApiResponse<null>,
      { id: number; image: File }
    >({
      query: ({ id, image }) => {
        const formData = new FormData();
        formData.append("image", image);
        return { url: `People/${id}/image`, method: "PATCH", body: formData };
      },
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Person", id },
        "Person",
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllPersonsQuery,
  useGetPersonByIdQuery,
  useLazyGetPersonByNationalNoQuery,
  useCreatePersonMutation,
  useUpdatePersonMutation,
  useDeletePersonMutation,
  useUploadPersonImageMutation,
  useGetPersonByNationalNoQuery,
} = peopleApi;
