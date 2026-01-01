import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import H2 from "@/components/layout/H2";
import Paragraph from "@/components/layout/Paragraph";
import TodaysBeer from "@/components/tables/TodaysBeer";
import { useAppSelector } from "@/redux/hooks";
import { getNameOfUser } from "@/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const HomePage = () => {
    const { currentUser } = useAppSelector((state) => state.authState);

    const { t } = useTranslation();

    if (!currentUser) return <FullScreenLoader />;

    return (
        <>
            <H1>
                {t("pages.home.header", {
                    name: getNameOfUser(currentUser),
                })}
            </H1>
            <H2>{t("pages.home.subheader")}</H2>
            <Paragraph>
                {t("pages.home.paragraph1")}{" "}
                <Link to="/beers" className="text-gray-950">
                    {t("pages.home.here")}
                </Link>
                . {t("pages.home.paragraph2")}{" "}
                <Link to="/calendar" className="text-gray-950">
                    {t("pages.home.calendaroverview")}
                </Link>{" "}
                {t("pages.home.paragraph3")}.
            </Paragraph>
            <Paragraph>{t("pages.home.paragraph4")}</Paragraph>
            <TodaysBeer />
        </>
    );
};

export default HomePage;
