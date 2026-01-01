import CalendarAdmin from "@/components/CalendarAdmin";
import ConditionalBlock from "@/components/ConditionalBlock";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import H2 from "@/components/layout/H2";
import Paragraph from "@/components/layout/Paragraph";
import MyCalendarsTable from "@/components/tables/MyCalendarsTable";
import { useGetBeersWithCalendarQuery } from "@/redux/api/beerApi";
import { useAppSelector } from "@/redux/hooks";
import { hasAuthority } from "@/utils";
import { useTranslation } from "react-i18next";

const CalendarsPage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector((state) => state.authState);
    const { data: beers } = useGetBeersWithCalendarQuery();
    const mybeers = beers ? beers.filter((beer) => !!beer.calendar) : [];

    if (!currentUser) return <FullScreenLoader />;

    return (
        <>
            <H1>{t("pages.calendar.header")}</H1>
            <ConditionalBlock show={hasAuthority(currentUser, "calendar:create")}>
                <CalendarAdmin />
            </ConditionalBlock>
            <ConditionalBlock show={mybeers.length > 0}>
                <H2>{t("pages.calendar.subheader")}</H2>
                <Paragraph>{t("pages.calendar.paragraph1")}</Paragraph>
                <MyCalendarsTable />
            </ConditionalBlock>
        </>
    );
};
export default CalendarsPage;
