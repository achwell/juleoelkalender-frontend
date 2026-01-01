import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { Review, ReviewData, ReviewWithUser } from "@/types/generated";
import { downloadBinaryData } from "@/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
    reducerPath: "reviewApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/review`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),

    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        getReviews: builder.query<ReviewWithUser[], void>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        downloadAllReviewsExcel: builder.mutation({
            async queryFn({ name, language }, _api, _extraOptions, baseQuery) {
                const result = await baseQuery({
                    url: `/export/${language}`,
                    cache: "no-cache",
                    responseHandler: (response) => response.blob(),
                });
                return downloadBinaryData(result, name);
            },
        }),
        getReviewDataByBeerId: builder.query<ReviewData[], string>({
            query: (id) => {
                return {
                    url: `/reviewdata/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getReview: builder.query<Review, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
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
                    url: `/bycalendarbeerandreviewer/${id.calendarId}/${id.beerId}/${id.reviewerId}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        addReview: builder.mutation<Review, Partial<Review>>({
            query: (body) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        updateReview: builder.mutation<Review, Pick<Review, "id"> & Partial<Review>>({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    reviewApi.util.updateQueryData("getReview", id!!, (draft) => {
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
        deleteReview: builder.mutation<{ success: boolean; id: string }, string>({
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
    useAddReviewMutation,
    useDeleteReviewMutation,
    useDownloadAllReviewsExcelMutation,
    useGetReviewQuery,
    useGetReviewsQuery,
    useGetReviewDataByBeerIdQuery,
    useGetReviewByCalendarBeerAndReviewerQuery,
    useUpdateReviewMutation,
} = reviewApi;
