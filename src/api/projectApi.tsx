/// <reference types="vite/client" />
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateProjectById } from "./api";

// Define a service using a base URL and expected endpoints
export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_DASHBOARD_URL as string,
  }),
  tagTypes: ["getProjectsByClientId"],
  endpoints: (builder) => ({
    getProjectsByClientId: builder.query<any, string>({
      query: (client_id: string) => ({
        url: `/projects/?client=${client_id}`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
      transformResponse: (response: any[]) => {
        return response.map((project) => {
          return {
            ...project,
            checked: false,
            openProperties: false,
          };
        });
      },
      providesTags: ["getProjectsByClientId"],
    }),
    getProjectsByClientIdAndProjectId: builder.query<
      any,
      { client_id: string; project_id: string }
    >({
      query: ({ client_id, project_id }) => ({
        url: `/projects/?client=${client_id}&id=${project_id}`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
    }),
    getProjectsByClientIdAndIds: builder.query<
      any,
      { client_id: string; ids: string[] }
    >({
      query: ({ client_id, ids }) => {
        const result = ids.join(",");
        return {
          url: `/projects/?client=${client_id}&id=${result}`,
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        };
      },
    }),
    getClientDetailsByClientId: builder.query<any, string>({
      query: (client_id: string) => ({
        url: `/clients/${client_id}/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
    }),
    getProjectByClientId: builder.query<any, string>({
      query: (client_id: string) => ({
        url: `/projects/?client=${client_id}/`,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
    }),
    createProject: builder.mutation({
      query: ({ data }) => ({
        url: `/projects/`,
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      }),
      invalidatesTags: ["getProjectsByClientId"],
    }),
    updateProjectById: builder.mutation({
      query: ({ project_id, data }) => ({
        url: `/projects/${project_id}/`,
        method: "PATCH",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data).toString(),
      }),
      invalidatesTags: ["getProjectsByClientId"],
    }),
    deleteProjectById: builder.mutation({
      query: ({ project_id }) => ({
        url: `/projects/${project_id}/`,
        method: "DELETE",
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      }),
      invalidatesTags: ["getProjectsByClientId"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetProjectsByClientIdQuery,
  useCreateProjectMutation,
  useGetProjectsByClientIdAndProjectIdQuery,
  useGetClientDetailsByClientIdQuery,
  useGetProjectsByClientIdAndIdsQuery,
  useLazyGetProjectByClientIdQuery,
  useUpdateProjectByIdMutation,
} = projectApi;
