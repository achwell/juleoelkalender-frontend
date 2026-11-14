import ForgottenpasswordProps from "@/types/ForgottenpasswordProps";
import { PasswordChangeRequest, User } from "@/types/generated";
import { baseApi } from "@/redux/api/baseApi";

export const passwordChangeRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPasswordChangeRequests: builder.query<PasswordChangeRequest[], void>({
      query: () => {
        return {
          url: "/api/v1/passwordchange",
          credentials: "include",
        };
      },
      providesTags: ["PasswordChangeRequest"],
    }),
    getPasswordChangeRequest: builder.query<PasswordChangeRequest, string>({
      query: (id) => {
        return {
          url: `/api/v1/passwordchange/${id}`,
          credentials: "include",
        };
      },
      providesTags: ["PasswordChangeRequest"],
    }),
    addPasswordChangeRequest: builder.mutation<PasswordChangeRequest, Partial<PasswordChangeRequest>>({
      query: (body) => ({
        url: "/api/v1/passwordchange",
        credentials: "include",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PasswordChangeRequest"],
    }),
    updatePasswordChangeRequest: builder.mutation<
      PasswordChangeRequest,
      Pick<PasswordChangeRequest, "id"> & Partial<PasswordChangeRequest>
    >({
      query: ({ id, ...patch }) => ({
        url: `/api/v1/passwordchange/${id}`,
        credentials: "include",
        method: "PUT",
        body: patch,
      }),
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          passwordChangeRequestApi.util.updateQueryData("getPasswordChangeRequest", id, (draft) => {
            Object.assign(draft, patch);
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["PasswordChangeRequest"],
    }),
    deletePasswordChangeRequest: builder.mutation<{ success: boolean; id: string }, string>({
      query(id) {
        return {
          url: `/api/v1/passwordchange/${id}`,
          credentials: "include",
          method: "DELETE",
        };
      },
      invalidatesTags: ["PasswordChangeRequest"],
    }),
    changePassword: builder.mutation<
      User,
      Pick<ForgottenpasswordProps, "email"> & Pick<ForgottenpasswordProps, "password">
    >({
      query: ({ email, password, ...patch }) => ({
        url: `/api/v1/passwordchange/${email}/${password}`,
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
