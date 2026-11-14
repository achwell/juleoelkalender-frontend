import CalendarForm from "@/components/CalendarForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import { useGetCalendarsQuery } from "@/redux/api/calendarApi";
import { useAppSelector } from "@/redux/hooks";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

const CalendarEditPage = () => {
  const [openedAt] = useState(() => new Date());
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { currentCalendarToken } = useAppSelector((state) => state.calendarTokenState);
  const { data: calendarsData, refetch: refetchCalendars } = useGetCalendarsQuery();

  const existingCalendars = (calendarsData ?? []).map((c) => ({ id: c.id!, year: c.year, name: c.name }));
  const calendar = useMemo(
    () =>
      id === "new" && currentCalendarToken
        ? {
            id: "N/A",
            name: "",
            year: openedAt.getFullYear(),
            published: false,
            archived: false,
            calendarToken: currentCalendarToken,
            beerCalendars: [],
          }
        : calendarsData?.find((c) => c.id === id),
    [id, currentCalendarToken, calendarsData, openedAt],
  );

  const refreshData = async () => {
    refetchCalendars();
    navigate("/calendar");
  };

  if (!calendar) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <H1>{calendar.id ? t("pages.calendarview.headerupdate") : t("pages.calendarview.headercreate")}</H1>
      <CalendarForm calendar={calendar} existingCalendars={existingCalendars} callback={refreshData} />
    </>
  );
};
export default CalendarEditPage;
