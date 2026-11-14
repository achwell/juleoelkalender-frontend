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
import { handleErrorWithStatus } from "@/utils";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
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

const LoginProviders = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [loginWithGoogleRequest] = useLoginWithGoogleMutation();
  const loginWithGoogle = async (...args: Parameters<typeof loginWithGoogleRequest>) => {
    const result = await loginWithGoogleRequest(...args);

    await handleLogin(result.data, result.error);

    return result;
  };

  const [loginWithFacebookRequest] = useLoginWithFacebookMutation();
  const loginWithFacebook = async (...args: Parameters<typeof loginWithFacebookRequest>) => {
    const result = await loginWithFacebookRequest(...args);

    await handleLogin(result.data, result.error);

    return result;
  };

  const [loginUserRequest] = useLoginUserMutation();
  const loginUser = async (...args: Parameters<typeof loginUserRequest>) => {
    const result = await loginUserRequest(...args);

    await handleLogin(result.data, result.error);

    return result;
  };

  const [logDevice] = useLogDeviceMutation();

  const handleLogin = async (
    response: LoginResponse | undefined,
    error: FetchBaseQueryError | SerializedError | undefined,
  ) => {
    if (response) {
      if (response.token) loginOK(response);
      else addTokenToUser(response.user.email);
    } else if (error) {
      await loginNotOk(error);
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
    handleErrorWithStatus(t, error);
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
