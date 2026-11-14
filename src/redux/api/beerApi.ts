import BeerWithCalendar from "@/types/BeerWithCalendar";
import BeerWithCalendarAndDayAndReview from "@/types/BeerWithCalendarAndDayAndReview";
import { Beer, BeerWithCalendarAndDay } from "@/types/generated";
import { downloadBinaryData } from "@/utils";
import { baseApi } from "@/redux/api/baseApi";

export const beerApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getBeers: builder.query<Beer[], void>({
        query: () => {
          return {
            url: "/api/v1/beer",
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      getAllBeersWithCalendar: builder.query<BeerWithCalendarAndDay[], void>({
        query: () => {
          return {
            url: "/api/v1/beer/allcalendar",
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      downloadAllBeersExcel: builder.mutation({
        async queryFn({ name, language }, _api, _extraOptions, baseQuery) {
          const result = await baseQuery({
            url: `/api/v1/beer/allcalendarexport/${language}`,
            cache: "no-cache",
            responseHandler: (response) => response.blob(),
          });
          return downloadBinaryData(result, name);
        },
      }),
      getBeersWithCalendar: builder.query<BeerWithCalendar[], void>({
        query: () => {
          return {
            url: "/api/v1/beer/calendar",
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      getBeersWithCalendarByCalendarId: builder.query<BeerWithCalendar[], string>({
        query: (id) => {
          return {
            url: `/api/v1/beer/calendar/${id}`,
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      getBeersWithReviewByCalendar: builder.query<BeerWithCalendarAndDayAndReview[], string>({
        query: (calendarId) => {
          return {
            url: `/api/v1/beer/review/${calendarId}`,
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      getBeersWithReviewByCalendarAndUser: builder.query<
        BeerWithCalendarAndDayAndReview[],
        {
          calendarId: string;
          userId: string;
        }
      >({
        query: ({ calendarId, userId }) => {
          return {
            url: `/api/v1/beer/review/${calendarId}/${userId}`,
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      getTodaysBeers: builder.query<BeerWithCalendarAndDayAndReview[], void>({
        query: () => {
          return {
            url: `/api/v1/beer/today`,
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      getBeer: builder.query<Beer, string>({
        query: (id) => {
          return {
            url: `/api/v1/beer/${id}`,
            credentials: "include",
          };
        },
        providesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      addBeer: builder.mutation<Beer, Partial<Beer>>({
        query: (body) => ({
          url: "/api/v1/beer",
          credentials: "include",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Beer", "Review", "Calendar", "User"],
      }),
      updateBeer: builder.mutation<Beer, Pick<Beer, "id"> & Partial<Beer>>({
        query: ({ id, ...patch }) => ({
          url: `/api/v1/beer/${id}`,
          credentials: "include",
          method: "PUT",
          body: patch,
        }),
        async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
          const patchResult = dispatch(
            beerApi.util.updateQueryData("getBeer", id, (draft) => {
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
      deleteBeer: builder.mutation<{ success: boolean; id: string }, string>({
        query(id) {
          return {
            url: `/api/v1/beer/${id}`,
            credentials: "include",
            method: "DELETE",
          };
        },
        invalidatesTags: ["Beer", "Review", "Calendar", "User"],
      }),
    };
  },
});
export const {
  useAddBeerMutation,
  useDeleteBeerMutation,
  useGetBeerQuery,
  useGetBeersWithCalendarQuery,
  useGetAllBeersWithCalendarQuery,
  useDownloadAllBeersExcelMutation,
  useGetBeersWithCalendarByCalendarIdQuery,
  useGetBeersWithReviewByCalendarQuery,
  useGetBeersWithReviewByCalendarAndUserQuery,
  useGetTodaysBeersQuery,
  useGetBeersQuery,
  useUpdateBeerMutation,
} = beerApi;
