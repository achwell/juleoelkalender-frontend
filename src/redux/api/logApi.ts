import { BASE_URL } from "@/environment";
import Device from "@/types/dashboard/Device";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const logApi = createApi({
    reducerPath: "logApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/log`,
        mode: "cors",
        credentials: "omit",
        prepareHeaders: (headers) => {
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            return headers;
        },
    }),
    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        log: builder.mutation<
            void,
            {
                message: string;
                logLevel: "trace" | "debug" | "info" | "warn" | "error";
            }
        >({
            query: ({ logLevel, message }) => ({
                url: `/${logLevel}`,
                credentials: "include",
                method: "POST",
                body: message,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        logDevice: builder.mutation<void, Partial<Device>>({
            query: (body) => ({
                url: "/logDevice",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
    }),
});
export const { useLogMutation, useLogDeviceMutation } = logApi;
