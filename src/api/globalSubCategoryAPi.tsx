import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface globalSubCategoryApiParams {
  category_id: string;
  style_data: any;
}

export const globalSubCategoryApi = createApi({
  reducerPath: "globalSubCategoryApi",
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
  tagTypes: ["globalSubCategoryApi"],
  endpoints: (builder) => ({
    // fetch global sub categories
    getGlobalSubCategory: builder.query<any, globalSubCategoryApiParams>({
      query: () => ({
        url: `/global-sub-category/`,
        method: "GET",
      }),
      providesTags: ["globalSubCategoryApi"],
    }),
    // update global sub category by category_id
    updateGlobalSubCategory: builder.mutation<any, globalSubCategoryApiParams>({
      query: ({ category_id, style_data }) => ({
        url: `/global-sub-category/${category_id}/`,
        method: "PATCH",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        body: style_data,
      }),
      invalidatesTags: ["globalSubCategoryApi"],
    }),
  }),
});

export const {
  useGetGlobalSubCategoryQuery,
  useUpdateGlobalSubCategoryMutation,
} = globalSubCategoryApi;
