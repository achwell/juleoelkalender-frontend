import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import DashboardData from "@/types/dashboard/DashboardData";
import Device from "@/types/dashboard/Device";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/dashboard`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        getDashboardData: builder.query<DashboardData, void>({
            query: () => {
                return {
                    url: "/dashboarddata",
                    credentials: "include",
                };
            },
            providesTags: ["Dashboard"],
        }),
        getDevices: builder.query<Device[], void>({
            query: () => {
                return {
                    url: "/devices",
                    credentials: "include",
                };
            },
            providesTags: ["Dashboard"],
        }),
    }),
});
export const { useGetDashboardDataQuery, useGetDevicesQuery } = dashboardApi;
