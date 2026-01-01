import { BASE_URL } from "@/environment";
import ForgottenpasswordProps from "@/types/ForgottenpasswordProps";
import { PasswordChangeRequest, User } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const passwordChangeRequestApi = createApi({
    reducerPath: "passwordChangeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/passwordchange`,
        mode: "cors",
        credentials: "omit",
        prepareHeaders: (headers) => {
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            return headers;
        },
    }),
    tagTypes: ["Beer", "Review", "Calendar", "User"],
    endpoints: (builder) => ({
        getPasswordChangeRequests: builder.query<PasswordChangeRequest[], void>({
            query: () => {
                return {
                    url: "",
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        getPasswordChangeRequest: builder.query<PasswordChangeRequest, string>({
            query: (id) => {
                return {
                    url: `/${id}`,
                    credentials: "include",
                };
            },
            providesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        addPasswordChangeRequest: builder.mutation<PasswordChangeRequest, Partial<PasswordChangeRequest>>({
            query: (body) => ({
                url: "",
                credentials: "include",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        updatePasswordChangeRequest: builder.mutation<
            PasswordChangeRequest,
            Pick<PasswordChangeRequest, "id"> & Partial<PasswordChangeRequest>
        >({
            query: ({ id, ...patch }) => ({
                url: `/${id}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
            async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    passwordChangeRequestApi.util.updateQueryData("getPasswordChangeRequest", id, (draft) => {
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
        deletePasswordChangeRequest: builder.mutation<{ success: boolean; id: string }, string>({
            query(id) {
                return {
                    url: `/${id}`,
                    credentials: "include",
                    method: "DELETE",
                };
            },
            invalidatesTags: ["Beer", "Review", "Calendar", "User"],
        }),
        changePassword: builder.mutation<
            User,
            Pick<ForgottenpasswordProps, "email"> & Pick<ForgottenpasswordProps, "password">
        >({
            query: ({ email, password, ...patch }) => ({
                url: `/${email}/${password}`,
                credentials: "include",
                method: "PUT",
                body: patch,
            }),
        }),
    }),
});
export const {
    useGetPasswordChangeRequestQuery,
    useGetPasswordChangeRequestsQuery,
    useAddPasswordChangeRequestMutation,
    useUpdatePasswordChangeRequestMutation,
    useDeletePasswordChangeRequestMutation,
    useChangePasswordMutation,
} = passwordChangeRequestApi;
