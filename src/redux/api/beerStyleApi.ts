import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { BeerStyle } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const beerStyleApi = createApi({
    reducerPath: "beerStyleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/beerstyle`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        getBeerStyles: builder.query<BeerStyle[], string | undefined>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getBeerStyle: builder.query<BeerStyle, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        addBeerStyle: builder.mutation<BeerStyle, Partial<BeerStyle>>({
            query: ({ id, ...body }) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        updateBeerStyle: builder.mutation<BeerStyle, Pick<BeerStyle, "id"> & Partial<BeerStyle>>({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    beerStyleApi.util.updateQueryData("getBeerStyle", id!, (draft) => {
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
        deleteBeerStyle: builder.mutation<{ success: boolean; id: string }, string>({
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
    useGetBeerStyleQuery,
    useGetBeerStylesQuery,
    useAddBeerStyleMutation,
    useUpdateBeerStyleMutation,
    useDeleteBeerStyleMutation,
} = beerStyleApi;
