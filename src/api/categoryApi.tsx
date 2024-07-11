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
    // fetch CategoryData
    getCategoryData: builder.query<any, categoryApiParams>({
      query: () => ({
        url: `/polygon-data/`,
        method: "GET",
      }),
    }),
    getCategoryDataById: builder.query<any, categoryApiParams>({
      query: ({ category_id }) => ({
        url: `/polygon-data/${category_id}/`,
        method: "GET",
      }),
    }),
    // // fetch category data by id
    // updateGlobalCategory: builder.mutat}ion<any, categoryApiParams>({
    //   query: ({ category_id, data }) => ({
    //     url: `/polygon-data/${category_id}/`,
    //     method: "PATCH",
    //     headers: {
    //       Authorization: "Token " + localStorage.getItem("token"),
    //     },
    //     body: data,
    //   }),
    // }),
  }),
});

export const {
  useGetCategoryDataQuery,
  useGetCategoryDataByIdQuery,
  //   useUpdateCategoryDataMutation,
} = categoryApi;
