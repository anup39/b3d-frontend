import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface globalCategoryApiParams {
  category_id: string;
  data: any;
}

export const globalCategoryApi = createApi({
  reducerPath: "globalCategoryApi",
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
  tagTypes: ["globalCategoryApi"],
  endpoints: (builder) => ({
    // create global category
    createGlobalCategory: builder.mutation<any, globalCategoryApiParams>({
      query: ({ data }) => ({
        url: `/global-category/`,
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        body: data,
      }),
    }),
    // fetch global categories
    getGlobalCategory: builder.query<any, globalCategoryApiParams>({
      query: () => ({
        url: `/global-category/`,
        method: "GET",
      }),
    }),
    // fetch global categories by id
    getGlobalCategoryById: builder.query<any, globalCategoryApiParams>({
      query: ({ category_id }) => ({
        url: `/global-category/`,
        method: "GET",
        params: { category_id },
      }),
    }),
    // update global category by category_id
    updateGlobalCategory: builder.mutation<any, globalCategoryApiParams>({
      query: ({ category_id, data }) => ({
        url: `/global-category/${category_id}/`,
        method: "PATCH",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateGlobalCategoryMutation,
  useGetGlobalCategoryQuery,
  useGetGlobalCategoryByIdQuery,
  useUpdateGlobalCategoryMutation,
} = globalCategoryApi;
