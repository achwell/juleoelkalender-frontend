import { BeerStyle } from "@/types/generated";
import { baseApi } from "@/redux/api/baseApi";

export const beerStyleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBeerStyles: builder.query<BeerStyle[], string | undefined>({
      query: () => {
        return {
          url: "/api/v1/beerstyle",
          credentials: "include",
        };
      },
      providesTags: ["BeerStyle"],
    }),
    getBeerStyle: builder.query<BeerStyle, string>({
      query: (id) => {
        return {
          url: `/api/v1/beerstyle/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["BeerStyle"],
    }),
    addBeerStyle: builder.mutation<BeerStyle, Partial<BeerStyle>>({
      query: ({ id: _id, ...body }) => ({
        url: "/api/v1/beerstyle",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["BeerStyle"],
    }),
    updateBeerStyle: builder.mutation<BeerStyle, Pick<BeerStyle, "id"> & Partial<BeerStyle>>({
      query: ({ id, ...patch }) => ({
        url: `/api/v1/beerstyle/${id}`,
        credentials: "include",
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          beerStyleApi.util.updateQueryData("getBeerStyle", id!, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["BeerStyle"],
    }),
    deleteBeerStyle: builder.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `/api/v1/beerstyle/${id}`,
          credentials: "include",
          method: "DELETE",
        };
      },
      invalidatesTags: ["BeerStyle"],
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
