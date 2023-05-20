// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const serverApi = createApi({
  reducerPath: "serverApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://proofshake.it/server/create/session",
  }),
  endpoints: (builder) => ({
    createSession: builder.mutation<any, string>({
      query(body) {
        return {
          url: "create/session",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useCreateSessionMutation } = serverApi;
