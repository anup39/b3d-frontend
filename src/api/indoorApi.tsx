import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface indoorApiParams {
  project_id: number;
  indoor_id: number;
}

export const indoorApi = createApi({
  reducerPath: "indoorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_DASHBOARD_URL as string,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["indoorApi"],
  endpoints: (builder) => ({
    // fetch indoor
    getIndoor: builder.query<any, indoorApiParams>({
      query: () => ({
        url: `/indoor/`,
        method: "GET",
      }),
    }),
    // fetch indoor by project id
    getIndoorByProjectId: builder.query<any, indoorApiParams>({
      query: ({ project_id }) => ({
        url: "/indoor/",
        method: "GET",
        params: { project_id },
      }),
      providesTags: ["indoorApi"],
    }),
    // create indoor by project id
    createIndoorByProjectId: builder.mutation<any, any>({
      query: ({ data }) => ({
        url: "/indoor/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["indoorApi"],
    }),
    // delete indoor by indoor id
    deleteIndoorById: builder.mutation<any, indoorApiParams>({
      query: ({ indoor_id }) => ({
        url: `/indoor/${indoor_id}/`,
        method: "DELETE",
        params: { indoor_id },
      }),
      invalidatesTags: ["indoorApi"],
    }),
  }),
});

export const {
  useGetIndoorQuery,
  useGetIndoorByProjectIdQuery,
  useCreateIndoorByProjectIdMutation,
  useDeleteIndoorByIdMutation,
} = indoorApi;
