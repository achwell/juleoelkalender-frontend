import RequestForm from "@/components/forgottenpassword/RequestForm";
import ResetPasswordForm from "@/components/forgottenpassword/ResetPasswordForm";
import H1 from "@/components/layout/H1";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useGetPasswordChangeRequestsQuery } from "@/redux/api/passwordChangeRequestApi";
import { PasswordChangeRequest } from "@/types/generated";
import { addHours, isAfter } from "date-fns";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

const ForgottenpasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const { data, isFetching } = useGetPasswordChangeRequestsQuery();
    const [passwordChangeRequest, setPasswordChangeRequest] = useState<PasswordChangeRequest>();

    useEffect(() => {
        if (email && token && data) {
            const request = data.filter((d) => d.email === email && d.token === token).at(0);
            if (request) {
                const now = new Date();
                const expires = addHours(request.created, 1);
                if (isAfter(expires, now)) {
                    setPasswordChangeRequest(request);
                }
            }
        }
    }, [email, token, isFetching]);

    const callback = () => {
        navigate("/");
    };

    return (
        <main className="max-w-xs mx-auto px-4">
            <div className="flex flex-col justify-center items-start">
                <div className="flex flex-row justify-end items-end">
                    <LanguageSelector />
                </div>
                <H1>{t("pages.forgottenpassword.title")}</H1>
                {!passwordChangeRequest && <RequestForm callback={callback} />}
                {passwordChangeRequest && <ResetPasswordForm passwordChangeRequest={passwordChangeRequest} />}
            </div>
        </main>
    );
};
export default ForgottenpasswordPage;
