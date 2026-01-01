import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { CalendarToken } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const calendarTokenApi = createApi({
    reducerPath: "calendarTokenApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/admin/calendartoken`,
        mode: "cors",
        credentials: "omit",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["CalendarToken"],
    endpoints: (builder) => ({
        getCalendarTokens: builder.query<CalendarToken[], void>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["CalendarToken"],
        }),
        getCalendarToken: builder.query<CalendarToken, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["CalendarToken"],
        }),
        addCalendarToken: builder.mutation<CalendarToken, Partial<CalendarToken>>({
            query: ({ id, ...body }) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["CalendarToken"],
        }),
        updateCalendarToken: builder.mutation<CalendarToken, Pick<CalendarToken, "id"> & Partial<CalendarToken>>({
            query: (body) => ({
                url: `/${body.id}`,
                credentials: "include",
                method: "PUT",
                body,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    calendarTokenApi.util.updateQueryData("getCalendarToken", id ?? "", (draft) => {
                        Object.assign(draft, patch);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ["CalendarToken"],
        }),
        deleteCalendarToken: builder.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `/${id}`,
                    credentials: "include",
                    method: "DELETE",
                };
            },
            invalidatesTags: ["CalendarToken"],
        }),
    }),
});
export const {
    useGetCalendarTokenQuery,
    useGetCalendarTokensQuery,
    useAddCalendarTokenMutation,
    useUpdateCalendarTokenMutation,
    useDeleteCalendarTokenMutation,
} = calendarTokenApi;
