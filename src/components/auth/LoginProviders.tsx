import FacebookLoginBox from "@/components/auth/FacebookLoginBox";
import GoogleLoginBox from "@/components/auth/GoogleLoginBox";
import UsernamePasswordBox from "@/components/auth/UsernamePasswordBox";
import { FB_APP_ID, GOOGLE_CLIENT_ID } from "@/environment";
import {
    LoginResponse,
    useLoginUserMutation,
    useLoginWithFacebookMutation,
    useLoginWithGoogleMutation,
} from "@/redux/api/authApi";
import { useLogDeviceMutation } from "@/redux/api/logApi";
import { setCurrentUser, setToken } from "@/redux/features/authSlice";
import { setCurrentCalendarToken } from "@/redux/features/calendarTokenSlice";
import { useAppDispatch } from "@/redux/hooks";
import { User } from "@/types/generated";
import { errorHandeling } from "@/utils";
import { useEffect } from "react";
import {
    browserName,
    browserVersion,
    isMobile,
    mobileModel,
    mobileVendor,
    osName,
    osVersion,
} from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const LoginProviders = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [
        loginWithGoogle,
        {
            isLoading: isLoadingGoogle,
            isError: isErrorGoogle,
            error: errorGoogle,
            isSuccess: isSuccessGoogle,
            data: loginResponseGoogle,
        },
    ] = useLoginWithGoogleMutation();
    const [
        loginWithFacebook,
        {
            isLoading: isLoadingFacebook,
            isError: isErrorFacebook,
            error: errorFacebook,
            isSuccess: isSuccessFacebook,
            data: loginResponseFacebook,
        },
    ] = useLoginWithFacebookMutation();
    const [
        loginUser,
        {
            isLoading: isLoadingPassword,
            isError: isErrorPassword,
            error: errorPassword,
            isSuccess: isSuccessPassword,
            data: loginResponsePassword,
        },
    ] = useLoginUserMutation();
    const [logDevice] = useLogDeviceMutation();

    useEffect(() => {
        handleLogin(isLoadingGoogle, isSuccessGoogle, isErrorGoogle, loginResponseGoogle, errorGoogle);
    }, [isLoadingGoogle, isSuccessGoogle, isErrorGoogle, loginResponseGoogle, errorGoogle]);

    useEffect(() => {
        handleLogin(isLoadingFacebook, isSuccessFacebook, isErrorFacebook, loginResponseFacebook, errorFacebook);
    }, [isLoadingFacebook, isSuccessFacebook, isErrorFacebook, loginResponseFacebook, errorFacebook]);

    useEffect(() => {
        handleLogin(isLoadingPassword, isSuccessPassword, isErrorPassword, loginResponsePassword, errorPassword);
    }, [isLoadingPassword, isSuccessPassword, isErrorPassword, loginResponsePassword, errorPassword]);

    const handleLogin = async (
        isLoading: boolean,
        isSuccess: boolean,
        isError: boolean,
        loginResponse: LoginResponse | undefined,
        error: FetchBaseQueryError | SerializedError | undefined
    ) => {
        if (!isLoading) {
            if (isSuccess && loginResponse) {
                if (!loginResponse.token) {
                    addTokenToUser(loginResponse.user.email);
                } else {
                    loginOK(loginResponse);
                }
            } else if (isError && error) {
                await loginNotOk(error);
            }
        }
    };

    const loginOK = (data: { token: string; user: User }) => {
        const { token, user } = data;
        logDevice({
            mobileVendor,
            mobileModel,
            isMobile,
            osName,
            osVersion,
            browserName,
            browserVersion,
            user,
        });
        const calendarTokens = user.calendarToken;
        const firstToken = calendarTokens.at(0);
        if (firstToken) {
            dispatch(setCurrentUser(user));
            dispatch(setToken(token));
            dispatch(setCurrentCalendarToken(firstToken));
            navigate("/");
        } else {
            dispatch(setCurrentUser(null));
            dispatch(setToken(null));
            dispatch(setCurrentCalendarToken(null));
        }
    };

    const loginNotOk = async (error: FetchBaseQueryError | SerializedError) => {
        logDevice({
            mobileVendor,
            mobileModel,
            isMobile,
            osName,
            osVersion,
            browserName,
            browserVersion,
        });
        invalidSession();
        errorHandeling(t, error);
    };

    const addTokenToUser = (email: string) => {
        navigate(`/addtoken?email=${email}`);
    };

    const invalidSession = () => {
        dispatch(setCurrentUser(null));
        dispatch(setToken(null));
        dispatch(setCurrentCalendarToken(null));
    };

    const onLoginStart = () => {
        invalidSession();
    };

    const onLogoutSuccess = () => {
        invalidSession();
        navigate("/login");
    };

    return (
        <>
            <UsernamePasswordBox loginUser={loginUser} />
            {FB_APP_ID && (
                <FacebookLoginBox
                    facebookAppId={FB_APP_ID}
                    loginWithFacebook={loginWithFacebook}
                    onLoginStart={onLoginStart}
                    onLogoutSuccess={onLogoutSuccess}
                />
            )}
            {GOOGLE_CLIENT_ID && <GoogleLoginBox googleClientId={GOOGLE_CLIENT_ID} loginWithGoogle={loginWithGoogle} />}
        </>
    );
};

export default LoginProviders;
