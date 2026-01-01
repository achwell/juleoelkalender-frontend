import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { BeerCalendar } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface MoveCalendar {
    calendarId: string;
    day: number;
    direction: "UP" | "DOWN";
}

export const beerCalendarApi = createApi({
    reducerPath: "beerCalendarApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/beercalendar`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        getBeerCalendars: builder.query<BeerCalendar[], void>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getBeerCalendar: builder.query<BeerCalendar, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        addBeerCalendar: builder.mutation<BeerCalendar, Partial<BeerCalendar>>({
            query: (body) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        moveBeerCalendars: builder.mutation<void, MoveCalendar>({
            query: ({ calendarId, day, direction }) => ({
                url: `/move/${calendarId}/${day}/${direction}`,
                credentials: "include",
                method: "POST",
                body: {},
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        updateBeerCalendar: builder.mutation<BeerCalendar, Pick<BeerCalendar, "id"> & Partial<BeerCalendar>>({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    beerCalendarApi.util.updateQueryData("getBeerCalendar", id ?? "", (draft) => {
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
        deleteBeerCalendar: builder.mutation<{ success: boolean; id: string }, string>({
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
    useAddBeerCalendarMutation,
    useDeleteBeerCalendarMutation,
    useGetBeerCalendarQuery,
    useGetBeerCalendarsQuery,
    useMoveBeerCalendarsMutation,
    useUpdateBeerCalendarMutation,
} = beerCalendarApi;
