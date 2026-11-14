import { BASE_URL } from "@/environment";
import type { RootState } from "@/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// These endpoints retain their existing public/header behavior.
const publicEndpoints = new Set([
  "registerUser",
  "loginUser",
  "loginWithFacebook",
  "loginWithGoogle",
  "addToken",
  "userExist",
  "log",
  "logDevice",
  "metrics",
  "health",
  "httpexchanges",
  "getPasswordChangeRequests",
  "getPasswordChangeRequest",
  "addPasswordChangeRequest",
  "updatePasswordChangeRequest",
  "deletePasswordChangeRequest",
  "changePassword",
]);

// Endpoint definitions stay in their feature files, sharing cache tags and middleware.
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).authState.token;
      if (token && !publicEndpoints.has(endpoint)) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Beer", "Review", "Calendar", "User", "CalendarToken", "BeerStyle", "PasswordChangeRequest", "Dashboard"],
  endpoints: () => ({}),
});
