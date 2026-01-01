import { BASE_URL } from "@/environment";
import Exchange from "@/types/dashboard/Exchange";
import HealthStatus from "@/types/dashboard/HealthStatus";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Metric {
    name: string;
    description: string;
    baseUnit: string;
    measurements: Measurement[];
    availableTags: AvailableTag[];
}

export interface Measurement {
    statistic: string;
    value: number;
}

export interface AvailableTag {
    tag: string;
    values: string[];
}

export const actuatorApi = createApi({
    reducerPath: "actuatorApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/actuator`,
        mode: "cors",
        credentials: "omit",
        prepareHeaders: (headers) => {
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            return headers;
        },
    }),
    tagTypes: ["Dashboard"],
    endpoints: (builder) => ({
        metrics: builder.query<Metric, string>({
            query(requiredMetricName) {
                return {
                    url: `/metrics/${requiredMetricName}`,
                    credentials: "include",
                };
            },
        }),
        health: builder.query<HealthStatus, void>({
            query() {
                return {
                    url: "/health",
                    credentials: "include",
                };
            },
        }),
        httpexchanges: builder.query<{ exchanges: Exchange[] }, void>({
            query: () => {
                return {
                    url: "/httpexchanges",
                    credentials: "include",
                };
            },
        }),
    }),
});
export const { useHealthQuery, useMetricsQuery, useHttpexchangesQuery } = actuatorApi;
