import { Calendar, CalendarWithBeer } from "@/types/generated";
import { baseApi } from "@/redux/api/baseApi";

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendars: builder.query<Calendar[], void>({
      query: () => {
        return {
          url: "/api/v1/calendar",
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getCalendarWithBeers: builder.query<CalendarWithBeer[], string>({
      query: (calendarId) => {
        return {
          url: `/api/v1/calendar/beer/${calendarId}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getCalendar: builder.query<Calendar, string>({
      query: (id) => {
        return {
          url: `/api/v1/calendar/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    addCalendar: builder.mutation<Calendar, Calendar>({
      query: (body) => ({
        url: "/api/v1/calendar",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    updateCalendar: builder.mutation<Calendar, Pick<Calendar, "id"> & Partial<Calendar>>({
      query: ({ id, ...patch }) => ({
        url: `/api/v1/calendar/${id}`,
        credentials: "include",
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          calendarApi.util.updateQueryData("getCalendar", id!, (draft) => {
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
    deleteCalendar: builder.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `/api/v1/calendar/${id}`,
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
