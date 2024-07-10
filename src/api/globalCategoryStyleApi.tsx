import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface globalCategoryStyleApiParams {
  category_style_id: string;
  style_data: any;
}

export const globalCategoryStyleApi = createApi({
  reducerPath: "globalCategoryStyleApi",
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
  tagTypes: ["globalCategoryStyleApi"],
  endpoints: (builder) => ({
    // fetch global categories styles
    getGlobalCategoryStyle: builder.query<any, globalCategoryStyleApiParams>({
      query: () => ({
        url: `/global-category-style/`,
        method: "GET",
      }),
    }),
    // update global category style by category_id
    updateGlobalCategoryStyle: builder.mutation<
      any,
      globalCategoryStyleApiParams
    >({
      query: ({ category_style_id, style_data }) => ({
        url: `/global-category-style/${category_style_id}/`,
        method: "PATCH",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        body: style_data,
      }),
    }),
  }),
});

export const {
  useGetGlobalCategoryStyleQuery,
  useUpdateGlobalCategoryStyleMutation,
} = globalCategoryStyleApi;
