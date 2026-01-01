import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { User } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RefreshResponse {
    token: string;
    user: User;
}

export const refreshApi = createApi({
    reducerPath: "refreshApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/auth`,
        credentials: "omit",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        refresh: builder.query<RefreshResponse, string>({
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            query: (_) => {
                return {
                    url: "/refresh",
                    credentials: "include",
                };
            },
        }),
    }),
});

export const { useRefreshQuery } = refreshApi;
