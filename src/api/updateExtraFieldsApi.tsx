import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface updateExtraFieldsApiParams {
  data: any;
}

export const updateExtraFieldsApi = createApi({
  reducerPath: "updateExtraFieldsApi",
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
  tagTypes: ["updateExtraFieldsApi"],
  endpoints: (builder) => ({
    // add extra fields
    addExtraFields: builder.mutation<any, updateExtraFieldsApiParams>({
      query: ({ data }) => ({
        url: `/update-extra-fields/`,
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        body: data,
      }),
    }),
  }),
});

export const { useAddExtraFieldsMutation } = updateExtraFieldsApi;
