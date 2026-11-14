import FacebookLoginRequest from "@/types/externalauth/FacebookLoginRequest";
import GoogleLoginRequest from "@/types/externalauth/GoogleLoginRequest";
import { User } from "@/types/generated";
import IGenericResponse from "@/types/IGenericResponse";
import LoginInput from "@/types/LoginInput";
import RegisterInput from "@/types/RegisterInput";
import { baseApi } from "@/redux/api/baseApi";

export interface LoginResponse {
  token: string;
  status?: string;
  message?: string;
  user: User;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<IGenericResponse, RegisterInput>({
      query(data) {
        return {
          url: "/api/v1/auth/register",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
    }),
    loginUser: builder.mutation<LoginResponse, LoginInput>({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      query({ showPassword, ...data }) {
        return {
          url: "/api/v1/auth/authenticate",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
    }),
    loginWithFacebook: builder.mutation<LoginResponse, FacebookLoginRequest>({
      query(data) {
        return {
          url: "/api/v1/auth/facebookauthenticate",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
    }),
    loginWithGoogle: builder.mutation<LoginResponse, GoogleLoginRequest>({
      query(data) {
        return {
          url: "/api/v1/auth/googleauthenticate",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
    }),
    addToken: builder.mutation<void, { email: string; token: string }>({
      query(data) {
        return {
          url: "/api/v1/auth/addtoken",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
    }),
    userExist: builder.query<boolean, string>({
      query: (email) => {
        return {
          url: `/api/v1/auth/userExist/${email}`,
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useAddTokenMutation,
  useLoginUserMutation,
  useLoginWithFacebookMutation,
  useLoginWithGoogleMutation,
  useRegisterUserMutation,
  useUserExistQuery,
} = authApi;
