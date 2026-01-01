import { BASE_URL } from "@/environment";
import IGenericResponse from "@/types/IGenericResponse";
import LoginInput from "@/types/LoginInput";
import RegisterInput from "@/types/RegisterInput";
import FacebookLoginRequest from "@/types/externalauth/FacebookLoginRequest";
import GoogleLoginRequest from "@/types/externalauth/GoogleLoginRequest";
import { User } from "@/types/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginResponse {
    token: string;
    status?: string;
    message?: string;
    user: User;
}

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/auth`,
        credentials: "omit",
        prepareHeaders: (headers) => {
            headers.set("Access-Control-Allow-Headers", "content-type, x-requested-with");
            return headers;
        },
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation<IGenericResponse, RegisterInput>({
            query(data) {
                return {
                    url: "/register",
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
                    url: "/authenticate",
                    method: "POST",
                    body: data,
                    credentials: "include",
                };
            },
        }),
        loginWithFacebook: builder.mutation<LoginResponse, FacebookLoginRequest>({
            query(data) {
                return {
                    url: "/facebookauthenticate",
                    method: "POST",
                    body: data,
                    credentials: "include",
                };
            },
        }),
        loginWithGoogle: builder.mutation<LoginResponse, GoogleLoginRequest>({
            query(data) {
                return {
                    url: "/googleauthenticate",
                    method: "POST",
                    body: data,
                    credentials: "include",
                };
            },
        }),
        addToken: builder.mutation<void, { email: string; token: string }>({
            query(data) {
                return {
                    url: "/addtoken",
                    method: "POST",
                    body: data,
                    credentials: "include",
                };
            },
        }),
        userExist: builder.query<boolean, string>({
            query: (email) => {
                return {
                    url: `/userExist/${email}`,
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
