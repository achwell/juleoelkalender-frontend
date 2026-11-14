import { baseApi } from "@/redux/api/baseApi";
import FullScreenLoader from "@/components/FullScreenLoader";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { setCurrentUser, setToken } from "@/redux/features/authSlice";
import { setCurrentCalendarToken } from "@/redux/features/calendarTokenSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const LogoutPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setCurrentUser(null));
    dispatch(setToken(null));
    dispatch(setCurrentCalendarToken(null));
    dispatch(baseApi.util.resetApiState());
    navigate("/login");
    toast.success("Logget ut", { position: "top-right" });
  }, [dispatch, navigate]);

  return (
    <>
      <div className="flex flex-row justify-end items-end">
        <LanguageSelector />
      </div>
      <FullScreenLoader>{t("pages.logout.header")}</FullScreenLoader>
    </>
  );
};
export default LogoutPage;
