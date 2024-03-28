import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.VITE_API_DASHBOARD_URL as string,
  }),

  endpoints: (builder) => ({
    getProjectsByClientId: builder.query<any, string>({
      query: (client_id: string) => ({
        url: `/projects/?client=${client_id}`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
    }),
    getClientDetailsByClientId: builder.query<any, string>({
      query: (client_id: string) => ({
        url: `/clients/${client_id}/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProjectsByClientIdQuery,
  useGetClientDetailsByClientIdQuery,
} = projectApi;
