import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface rolesApiParams {
  user: string;
  client: number;
  project: string;
}

export const rolesApi = createApi({
  reducerPath: "rolesApi",
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
  tagTypes: ["rolesApi"],
  endpoints: (builder) => ({
    // fetch roles data by projectId
    getRolesDataByProjectId: builder.query<any, rolesApiParams>({
      query: ({ project }) => ({
        url: `/roles/?project=${project}`,
        method: "GET",
      }),
    }),
    // fetch roles data by projectId
    getRolesDataByClientId: builder.query<any, rolesApiParams>({
      query: ({ client }) => ({
        url: `/roles/?client=${client}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetRolesDataByProjectIdQuery,
  useGetRolesDataByClientIdQuery,
} = rolesApi;
