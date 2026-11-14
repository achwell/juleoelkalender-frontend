import { User } from "@/types/generated";
import { downloadBinaryData } from "@/utils";
import { baseApi } from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => {
        return {
          url: "/api/v1/user",
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getUser: builder.query<User, string>({
      query: (id) => {
        return {
          url: `/api/v1/user/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    getUserByEmail: builder.query<User, string>({
      query: (email) => {
        return {
          url: `/api/v1/user/email/${email}`,
          credentials: "include",
        };
      },
      providesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query: (body) => ({
        url: "/api/v1/user",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    updateUser: builder.mutation<User, Pick<User, "id"> & Partial<User>>({
      query: ({ id, ...patch }) => ({
        url: `/api/v1/user/${id}`,
        credentials: "include",
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("getUser", id!, (draft) => {
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
    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `/api/v1/user/${id}`,
          credentials: "include",
          method: "DELETE",
        };
      },
      invalidatesTags: ["Beer", "Review", "Calendar", "User"],
    }),
    downloadAllUsersExcel: builder.mutation({
      async queryFn({ name, language }, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: `/api/v1/user/export/${language}`,
          cache: "no-cache",
          responseHandler: (response) => response.blob(),
        });
        return downloadBinaryData(result, name);
      },
    }),
  }),
});
export const {
  useAddUserMutation,
  useDeleteUserMutation,
  useDownloadAllUsersExcelMutation,
  useGetUserQuery,
  useGetUserByEmailQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userApi;
