import Exchange from "@/types/dashboard/Exchange";
import HealthStatus from "@/types/dashboard/HealthStatus";
import { baseApi } from "@/redux/api/baseApi";

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

export const actuatorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    metrics: builder.query<Metric, string>({
      query(requiredMetricName) {
        return {
          url: `/actuator/metrics/${requiredMetricName}`,
          credentials: "include",
        };
      },
    }),
    health: builder.query<HealthStatus, void>({
      query() {
        return {
          url: "/actuator/health",
          credentials: "include",
        };
      },
    }),
    httpexchanges: builder.query<{ exchanges: Exchange[] }, void>({
      query: () => {
        return {
          url: "/actuator/httpexchanges",
          credentials: "include",
        };
      },
    }),
  }),
});
export const { useHealthQuery, useMetricsQuery, useHttpexchangesQuery } = actuatorApi;
