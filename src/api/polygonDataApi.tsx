import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface polygonDataApiParams {
  data: any;
}

export const polygonDataApi = createApi({
  reducerPath: "polygonDataApi",
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
  tagTypes: ["polygonDataApi"],
  endpoints: (builder) => ({
    // fetch polygon data
    getPolygonData: builder.query<any, polygonDataApiParams>({
      query: () => ({
        url: `/polygon-data/`,
        method: "GET",
      }),
      providesTags: ["polygonDataApi"],
    }),
    // create polygon data
    createPolygonData: builder.mutation<any, polygonDataApiParams>({
      query: ({ data }) => ({
        url: `/polygon-data/`,
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
        body: data,
      }),
      invalidatesTags: ["polygonDataApi"],
    }),
  }),
});

export const { useCreatePolygonDataMutation, useGetPolygonDataQuery } =
  polygonDataApi;
