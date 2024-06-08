/// <reference types="vite/client" />
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_DASHBOARD_URL as string,
  }),

  endpoints: (builder) => ({
    getClients: builder.query<any, string>({
      query: () => ({
        url: `/clients/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
    }),
    getClientsByClientId: builder.query<any, { client_id: string }>({
      query: ({ client_id }) => ({
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
export const { useGetClientsQuery, useGetClientsByClientIdQuery } = clientApi;
