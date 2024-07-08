import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface rasterDataApiParams {
  project: string;
  isDisplay: number;
  client: string;
}

export const rasterDataApi = createApi({
  reducerPath: "rasterDataApi",
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
  tagTypes: ["rasterDataApi"],
  endpoints: (builder) => ({
    // fetch raster data by projectId
    getRasterDataByProjectId: builder.query<any, rasterDataApiParams>({
      query: ({ project }) => ({
        url: `/raster-data/?project=${project}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetRasterDataByProjectIdQuery } = rasterDataApi;
