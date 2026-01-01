import { BASE_URL } from "@/environment";
import i18n from "@/i18n";
import FacebookLogin from "@/types/externalauth/FacebookLogin";
import FacebookLoginRequest from "@/types/externalauth/FacebookLoginRequest";
import { FC } from "react";
import { FacebookLoginButton } from "react-social-login-buttons";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { IResolveParams, LoginSocialFacebook } from "reactjs-social-login";

interface Props {
    facebookAppId: string;
    loginWithFacebook: (facebookLoginRequest: FacebookLoginRequest) => void;
    onLoginStart: () => void;
    onLogoutSuccess: () => void;
}

const FacebookLoginBox: FC<Props> = ({ facebookAppId, loginWithFacebook, onLoginStart, onLogoutSuccess }) => {
    return (
        <LoginSocialFacebook
            language={i18n.language}
            appId={facebookAppId}
            fieldsProfile={"id,first_name,last_name,middle_name,email,picture"}
            onLoginStart={onLoginStart}
            onLogoutSuccess={onLogoutSuccess}
            redirect_uri={BASE_URL}
            onResolve={({ data }: IResolveParams) => {
                if (data) {
                    const facebookData = data as FacebookLogin;
                    const {
                        id,
                        first_name: firstName,
                        middle_name: middleName,
                        last_name: lastName,
                        email,
                        picture,
                    } = facebookData;
                    loginWithFacebook({
                        id,
                        firstName,
                        middleName,
                        lastName,
                        email,
                        picture: picture
                            ? {
                                  data: {
                                      height: picture.data.height,
                                      isSilhouette: picture.data.is_silhouette,
                                      width: picture.data.width,
                                      url: picture.data.url,
                                  },
                              }
                            : undefined,
                    });
                }
            }}
            onReject={(err: string) => {
                console.warn(err);
            }}
        >
            <FacebookLoginButton />
        </LoginSocialFacebook>
    );
};
export default FacebookLoginBox;
