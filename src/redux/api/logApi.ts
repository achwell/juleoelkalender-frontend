import Device from "@/types/dashboard/Device";
import { baseApi } from "@/redux/api/baseApi";

export const logApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    log: builder.mutation<
      void,
      {
        message: string;
        logLevel: "trace" | "debug" | "info" | "warn" | "error";
      }
    >({
      query: ({ logLevel, message }) => ({
        url: `/api/v1/log/${logLevel}`,
        credentials: "include",
        method: "POST",
        body: message,
      }),
    }),
    logDevice: builder.mutation<void, Partial<Device>>({
      query: (body) => ({
        url: "/api/v1/log/logDevice",
        credentials: "include",
        method: "POST",
        body,
      }),
    }),
  }),
});
export const { useLogMutation, useLogDeviceMutation } = logApi;
