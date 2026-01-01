import FullScreenLoader from "@/components/FullScreenLoader";
import BeerTable from "@/components/calendar/BeerTable";
import H1 from "@/components/layout/H1";
import H2 from "@/components/layout/H2";
import Paragraph from "@/components/layout/Paragraph";
import { useGetBeersWithReviewByCalendarAndUserQuery } from "@/redux/api/beerApi";
import { useGetCalendarQuery } from "@/redux/api/calendarApi";
import { useAppSelector } from "@/redux/hooks";
import BeerDetails from "@/types/BeerDetails";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

const CalendarViewPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { calendarId } = useParams();

    const { currentUser } = useAppSelector((state) => state.authState);

    const { data: allBeers, isFetching: isFetchingBeers } = useGetBeersWithReviewByCalendarAndUserQuery(
        { calendarId: calendarId || "", userId: currentUser?.id || "" },
        { skip: !calendarId || !currentUser }
    );
    const [beers, setBeers] = useState<BeerDetails[]>([]);

    const { data: calendar } = useGetCalendarQuery(calendarId ?? "");

    useEffect(() => {
        if (calendar && allBeers && currentUser) {
            const calendarBeers = allBeers
                .map((beer) => ({
                    calendarId: beer.calendar.id!!,
                    day: beer.day,
                    beer: beer.beer,
                    review: beer.review,
                }))
                .sort((a, b) => {
                    if (a.day > b.day) return 1;
                    if (b.day > a.day) return -1;
                    return 0;
                });
            setBeers(calendarBeers);
        }
    }, [calendar, allBeers, isFetchingBeers]);

    if (!calendar || !currentUser || !beers) return <FullScreenLoader />;

    return (
        <>
            <H1>{t("pages.calendarview.header")}</H1>
            <H2>
                {t("pages.calendarview.subheader", {
                    name: calendar.name,
                    year: calendar.year,
                })}
            </H2>
            <div className="w-full p-4">
                <Paragraph>{t("pages.calendarview.ingress")}</Paragraph>
                <BeerTable beers={beers} back={() => navigate("/calendar/")} />
            </div>
        </>
    );
};
export default CalendarViewPage;
