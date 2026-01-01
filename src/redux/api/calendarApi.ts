import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { Calendar, CalendarWithBeer } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const calendarApi = createApi({
    reducerPath: "calendarApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/calendar`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        getCalendars: builder.query<Calendar[], void>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getCalendarWithBeers: builder.query<CalendarWithBeer[], string>({
            query: (calendarId) => {
                return {
                    url: `/beer/${calendarId}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getCalendar: builder.query<Calendar, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        addCalendar: builder.mutation<Calendar, Calendar>({
            query: (body) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        updateCalendar: builder.mutation<Calendar, Pick<Calendar, "id"> & Partial<Calendar>>({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    calendarApi.util.updateQueryData("getCalendar", id!!, (draft) => {
                        Object.assign(draft, patch);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        deleteCalendar: builder.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `/${id}`,
                    credentials: "include",
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
    }),
});
export const {
    useAddCalendarMutation,
    useDeleteCalendarMutation,
    useGetCalendarQuery,
    useGetCalendarsQuery,
    useGetCalendarWithBeersQuery,
    useUpdateCalendarMutation,
} = calendarApi;
