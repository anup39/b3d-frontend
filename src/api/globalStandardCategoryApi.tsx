import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface globalStandardCategoryApiParams {
  category_id: string;
  data: any;
}

export const globalStandardCategoryApi = createApi({
  reducerPath: "globalStandardCategoryApi",
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
  tagTypes: ["globalStandardCategoryApi"],
  endpoints: (builder) => ({
    // fetch global categories
    getGlobalStandardCategory: builder.query<
      any,
      globalStandardCategoryApiParams
    >({
      query: () => ({
        url: `/global-standard-category/`,
        method: "GET",
      }),
      providesTags: ["globalStandardCategoryApi"],
    }),
  }),
});

export const { useGetGlobalStandardCategoryQuery } = globalStandardCategoryApi;
