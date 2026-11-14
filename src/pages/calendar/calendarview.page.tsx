import BeerTable from "@/components/calendar/BeerTable";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import H2 from "@/components/layout/H2";
import Paragraph from "@/components/layout/Paragraph";
import { useGetBeersWithReviewByCalendarAndUserQuery } from "@/redux/api/beerApi";
import { useGetCalendarQuery } from "@/redux/api/calendarApi";
import { useAppSelector } from "@/redux/hooks";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

const CalendarViewPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { calendarId } = useParams();

  const { currentUser } = useAppSelector((state) => state.authState);

  const { data: allBeers } = useGetBeersWithReviewByCalendarAndUserQuery(
    { calendarId: calendarId || "", userId: currentUser?.id || "" },
    { skip: !calendarId || !currentUser },
  );

  const { data: calendar } = useGetCalendarQuery(calendarId ?? "");

  const beers = useMemo(
    () =>
      (allBeers ?? [])
        .map((entry) => ({
          calendarId: entry.calendar.id!,
          day: entry.day,
          beer: entry.beer,
          review: entry.review,
        }))
        .toSorted((a, b) => a.day - b.day),
    [allBeers],
  );

  if (!calendar || !currentUser || !beers) {
    return <FullScreenLoader />;
  }

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
        <BeerTable beers={beers} back={async () => await navigate("/calendar/")} />
      </div>
    </>
  );
};
export default CalendarViewPage;
