import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface MeasuringFileUploadParams {
  client_id: string;
  project_id: number;
}

export const measuringFileUploadApi = createApi({
  reducerPath: "measuringFileUploadApi",
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
  tagTypes: [],
  endpoints: (builder) => ({
    getMeasuringFileUpload: builder.query<any, MeasuringFileUploadParams>({
      query: ({ client_id, project_id }) => ({
        url: `/measuring-file-upload/`,
        method: "GET",
        params: {
          client: client_id,
          project: project_id,
        },
      }),
    }),
  }),
});

export const { useGetMeasuringFileUploadQuery } = measuringFileUploadApi;
