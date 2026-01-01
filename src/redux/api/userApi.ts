import { BASE_URL } from "@/environment";
import { RootState } from "@/redux/store";
import { User } from "@/types/generated";
import { downloadBinaryData } from "@/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/user`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).authState.token;
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            headers.set("authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getUser: builder.query<User, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getUserByEmail: builder.query<User, string>({
            query: (email) => {
                return {
                    url: `/email/${email}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        addUser: builder.mutation<User, Partial<User>>({
            query: (body) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        updateUser: builder.mutation<User, Pick<User, "id"> & Partial<User>>({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    userApi.util.updateQueryData("getUser", id!!, (draft) => {
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
        deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `/${id}`,
                    credentials: "include",
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        downloadAllUsersExcel: builder.mutation({
            async queryFn({ name, language }, _api, _extraOptions, baseQuery) {
                const result = await baseQuery({
                    url: `/export/${language}`,
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
