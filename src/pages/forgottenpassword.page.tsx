import RequestForm from "@/components/forgottenpassword/RequestForm";
import ResetPasswordForm from "@/components/forgottenpassword/ResetPasswordForm";
import H1 from "@/components/layout/H1";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useGetPasswordChangeRequestsQuery } from "@/redux/api/passwordChangeRequestApi";
import { addHours, isAfter } from "date-fns";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

const ForgottenpasswordPage = () => {
  const [openedAt] = useState(() => new Date());
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const { data } = useGetPasswordChangeRequestsQuery();
  const passwordChangeRequest = useMemo(() => {
    if (!email || !token) return undefined;
    const request = data?.find((d) => d.email === email && d.token === token);
    return request && isAfter(addHours(request.created, 1), openedAt) ? request : undefined;
  }, [email, token, data, openedAt]);

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
