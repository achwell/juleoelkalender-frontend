import { CalendarToken } from "@/types/generated";
import { baseApi } from "@/redux/api/baseApi";

export const calendarTokenApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarTokens: builder.query<CalendarToken[], void>({
      query: () => {
        return {
          url: "/api/v1/admin/calendartoken",
          credentials: "include",
        };
      },
      providesTags: ["CalendarToken"],
    }),
    getCalendarToken: builder.query<CalendarToken, string>({
      query: (id) => {
        return {
          url: `/api/v1/admin/calendartoken/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["CalendarToken"],
    }),
    addCalendarToken: builder.mutation<CalendarToken, Partial<CalendarToken>>({
      query: ({ id: _id, ...body }) => ({
        url: "/api/v1/admin/calendartoken",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CalendarToken"],
    }),
    updateCalendarToken: builder.mutation<CalendarToken, Pick<CalendarToken, "id"> & Partial<CalendarToken>>({
      query: (body) => ({
        url: `/api/v1/admin/calendartoken/${body.id}`,
        credentials: "include",
        method: "PUT",
        body,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          calendarTokenApi.util.updateQueryData("getCalendarToken", id ?? "", (draft) => {
            Object.assign(draft, patch);
          }),
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
          url: `/api/v1/admin/calendartoken/${id}`,
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
