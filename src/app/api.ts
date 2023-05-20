// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const serverApi = createApi({
  reducerPath: "serverApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/server/",
  }),
  endpoints: (builder) => ({
    createSession: builder.mutation({
      query() {
        return {
          url: "create-session",
          method: "POST",
        };
      },
    }),
    statusSession: builder.mutation({
      query({ sessionid }) {
        return {
          url: "session-status",
          method: "POST",
          body: { sessionid },
        };
      },
    }),
    getStatusSession: builder.query({
      query({ sessionid }) {
        return {
          url: "session-status",
          method: "POST",
          body: { sessionid },
        };
      },
    }),
    submitSessionResult: builder.mutation({
      query({ sessionid, proofstring }) {
        return {
          url: "submit-session-result",
          method: "POST",
          body: { sessionid, proofstring },
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateSessionMutation,
  useStatusSessionMutation,
  useGetStatusSessionQuery,
  useSubmitSessionResultMutation,
} = serverApi;
