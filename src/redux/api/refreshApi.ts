import { User } from "@/types/generated";
import { baseApi } from "@/redux/api/baseApi";

interface RefreshResponse {
  token: string;
  user: User;
}

export const refreshApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refresh: builder.query<RefreshResponse, string>({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      query: (_) => {
        return {
          url: "/api/v1/auth/refresh",
          credentials: "include",
        };
      },
    }),
  }),
});

export const { useRefreshQuery } = refreshApi;
