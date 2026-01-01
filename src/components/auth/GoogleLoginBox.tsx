import GoogleLoginRequest from "@/types/externalauth/GoogleLoginRequest";
import { getUserFromGoogleLogin } from "@/utils";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { FC } from "react";

interface Props {
    googleClientId: string;
    loginWithGoogle: (googleLoginRequest: GoogleLoginRequest) => void;
}

const GoogleLoginBox: FC<Props> = ({ googleClientId, loginWithGoogle }) => {
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin
                shape="pill"
                text="signin"
                auto_select={false}
                theme="filled_blue"
                ux_mode="popup"
                onSuccess={async (credentialResponse) => {
                    const { credential, clientId } = credentialResponse;
                    if (credential && clientId) {
                        const user = getUserFromGoogleLogin(credential);
                        const { email, family_name: familyName, given_name: givenName, picture } = user;
                        loginWithGoogle({ credential, email, familyName, givenName, picture });
                    }
                }}
                onError={() => {
                    console.warn("Login Failed");
                }}
            />
        </GoogleOAuthProvider>
    );
};
export default GoogleLoginBox;
