import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface categoryApiParams {
  category_id: string;
  data: any;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
  tagTypes: ["categoryApi"],
  endpoints: (builder) => ({
    // fetch category data
    getCategoryData: builder.query<any, categoryApiParams>({
      query: () => ({
        url: `/category/`,
        method: "GET",
      }),
    }),
    // fetch category data by id
    getCategoryDataById: builder.query<any, categoryApiParams>({
      query: ({ category_id }) => ({
        url: `/category/${category_id}/`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCategoryDataQuery, useGetCategoryDataByIdQuery } =
  categoryApi;
