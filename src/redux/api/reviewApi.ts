import { Review, ReviewData, ReviewWithUser } from "@/types/generated";
import { downloadBinaryData } from "@/utils";
import { baseApi } from "@/redux/api/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<ReviewWithUser[], void>({
      query: () => {
        return {
          url: "/api/v1/review",
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    downloadAllReviewsExcel: builder.mutation({
      async queryFn({ name, language }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `/api/v1/review/export/${language}`,
          cache: "no-cache",
          responseHandler: (response) => response.blob(),
        });
        return downloadBinaryData(result, name);
      },
    }),
    getReviewDataByBeerId: builder.query<ReviewData[], string>({
      query: (id) => {
        return {
          url: `/api/v1/review/reviewdata/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getReview: builder.query<Review, string>({
      query: (id) => {
        return {
          url: `/api/v1/review/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getReviewByCalendarBeerAndReviewer: builder.query<
      Review,
      { calendarId: string; beerId: string; reviewerId: string }
    >({
      query: (id) => {
        return {
          url: `/api/v1/review/bycalendarbeerandreviewer/${id.calendarId}/${id.beerId}/${id.reviewerId}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    addReview: builder.mutation<Review, Partial<Review>>({
      query: (body) => ({
        url: "/api/v1/review",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    updateReview: builder.mutation<Review, Pick<Review, "id"> & Partial<Review>>({
      query: ({ id, ...patch }) => ({
        url: `/api/v1/review/${id}`,
        credentials: "include",
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          reviewApi.util.updateQueryData("getReview", id!, (draft) => {
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
    deleteReview: builder.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `/api/v1/review/${id}`,
          credentials: "include",
          method: "DELETE",
        };
      },
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
  }),
});
export const {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useDownloadAllReviewsExcelMutation,
  useGetReviewQuery,
  useGetReviewsQuery,
  useGetReviewDataByBeerIdQuery,
  useGetReviewByCalendarBeerAndReviewerQuery,
  useUpdateReviewMutation,
} = reviewApi;
