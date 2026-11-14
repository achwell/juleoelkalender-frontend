import { BeerCalendar, Direction } from "@/types/generated";
import { baseApi } from "@/redux/api/baseApi";

export interface MoveCalendar {
  calendarId: string;
  day: number;
  direction: Direction;
}

export const beerCalendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBeerCalendars: builder.query<BeerCalendar[], void>({
      query: () => {
        return {
          url: "/api/v1/beercalendar",
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getBeerCalendar: builder.query<BeerCalendar, string>({
      query: (id) => {
        return {
          url: `/api/v1/beercalendar/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    addBeerCalendar: builder.mutation<BeerCalendar, Partial<BeerCalendar>>({
      query: (body) => ({
        url: "/api/v1/beercalendar",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    moveBeerCalendars: builder.mutation<void, MoveCalendar>({
      query: ({ calendarId, day, direction }) => ({
        url: `/api/v1/beercalendar/move/${calendarId}/${day}/${direction}`,
        credentials: "include",
        method: "POST",
        body: {},
      }),
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    updateBeerCalendar: builder.mutation<BeerCalendar, Pick<BeerCalendar, "id"> & Partial<BeerCalendar>>({
      query: ({ id, ...patch }) => ({
        url: `/api/v1/beercalendar/${id}`,
        credentials: "include",
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          beerCalendarApi.util.updateQueryData("getBeerCalendar", id ?? "", (draft) => {
            Object.assign(draft, patch);
          }),
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
          url: `/api/v1/beercalendar/${id}`,
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
