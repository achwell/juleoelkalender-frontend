import DashboardData from "@/types/dashboard/DashboardData";
import Device from "@/types/dashboard/Device";
import { baseApi } from "@/redux/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardData, void>({
      query: () => {
        return {
          url: "/api/v1/dashboard/dashboarddata",
          credentials: "include",
        };
      },
      providesTags: ["Dashboard"],
    }),
    getDevices: builder.query<Device[], void>({
      query: () => {
        return {
          url: "/api/v1/dashboard/devices",
          credentials: "include",
        };
      },
      providesTags: ["Dashboard"],
    }),
  }),
});
export const { useGetDashboardDataQuery, useGetDevicesQuery } = dashboardApi;
