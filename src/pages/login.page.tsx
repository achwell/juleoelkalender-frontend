import LoginProviders from "@/components/auth/LoginProviders";
import H1 from "@/components/layout/H1";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useGetBeerStylesQuery } from "@/redux/api/beerStyleApi";
import { setBeerStyles } from "@/redux/features/beerStylesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const { t } = useTranslation();

    const { currentUser } = useAppSelector((state) => state.authState);
    const dispatch = useAppDispatch();

    const { data: allBeersStyles } = useGetBeerStylesQuery(currentUser?.id, { skip: !currentUser });

    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser) {
            navigate("/");
        }
    }, [currentUser]);

    useEffect(() => {
        const styles = (allBeersStyles ?? [])
            .map((value) => value.name)
            .sort((a, b) => {
                const styleA = a.toUpperCase();
                const styleB = b.toUpperCase();
                if (styleA < styleB) {
                    return -1;
                }
                if (styleA > styleB) {
                    return 1;
                }
                return 0;
            });
        dispatch(setBeerStyles(styles));
    }, [allBeersStyles]);

    return (
        <main className="max-w-xs mx-auto px-4">
            <div className="flex flex-col justify-center items-start">
                <div className="flex flex-row justify-end items-end">
                    <LanguageSelector />
                </div>
                <H1>{t("pages.login.header")}</H1>
                <div>
                    <LoginProviders />
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
