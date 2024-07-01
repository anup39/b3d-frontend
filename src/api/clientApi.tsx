/// <reference types="vite/client" />
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchClientDetailsByClientId } from "./api";

// Define a service using a base URL and expected endpoints
export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_DASHBOARD_URL as string,
  }),
  tagTypes: ["Clients"],
  endpoints: (builder) => ({
    // Get all clients
    getClients: builder.query<any, string>({
      queryFn: async (client_id, _api, _extraOptions, baseQuery) => {
        _extraOptions = {
          refetchOnMountOrArgChange: true,
          refetchOnReconnect: true,
          forceRefetch: true,
        };
        console.log(_api, "_api");
        if (!client_id) {
          return baseQuery(`clients/`);
        } else {
          const results = await fetchClientDetailsByClientId(client_id);
          return { data: [results] };
        }
      },
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Clients", id })), "Clients"]
          : ["Clients"],
    }),
    // Get single client by id
    getClientsByClientId: builder.query<any, { client_id: string }>({
      query: ({ client_id }) => {
        return {
          url: `/clients/${client_id}/`,
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
          forceRefetch: true,
          refetchOnMountOrArgChange: true,
          refetchOnReconnect: true,
        };
      },
      transformResponse: (response: any[]) => {
        return [response];
      },
    }),
    // Create new client
    createClient: builder.mutation({
      query: ({ data }) => ({
        url: `/clients/`,
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Clients", id: arg.id },
      ],
    }),
    // Update single client by id
    updateClientById: builder.mutation({
      query: ({ client_id, data }) => ({
        url: `/clients/${client_id}/`,
        method: "PATCH",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Clients", id: arg.id },
      ],
    }),
    // Delete single client by id
    deleteClientById: builder.mutation({
      query: ({ client_id }) => ({
        url: `/clients/${client_id}/`,
        method: "DELETE",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Clients", id: arg.id },
      ],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetClientsQuery,
  useGetClientsByClientIdQuery,
  useCreateClientMutation,
  useUpdateClientByIdMutation,
  useDeleteClientByIdMutation,
} = clientApi;
