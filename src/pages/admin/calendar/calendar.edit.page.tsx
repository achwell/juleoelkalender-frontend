import CalendarForm from "@/components/CalendarForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import { useGetCalendarsQuery } from "@/redux/api/calendarApi";
import { useAppSelector } from "@/redux/hooks";
import CalendarId from "@/types/CalendarId";
import { Calendar } from "@/types/generated";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";

const CalendarEditPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const { currentUser } = useAppSelector((state) => state.authState);
    const { currentCalendarToken } = useAppSelector((state) => state.calendarTokenState);
    const { data: calendarsData, isFetching: isFetchingCalendars, refetch: refetchCalendars } = useGetCalendarsQuery();

    const [calendar, setCalendar] = useState<Calendar>();
    const [existingCalendars, setExistingCalendar] = useState<CalendarId[]>([]);

    useEffect(() => {
        if (!isFetchingCalendars && !!calendarsData) {
            setExistingCalendar(calendarsData.map((c) => ({ id: c.id!!, year: c.year, name: c.name })));
        }
    }, [isFetchingCalendars, calendarsData]);

    useEffect(() => {
        if (!isFetchingCalendars && !!calendarsData && id && id !== "new") {
            setCalendar(calendarsData.filter((c) => c.id === id).at(0));
        } else if (id === "new" && currentCalendarToken) {
            const calendarToken = currentCalendarToken;
            setCalendar({
                id: "N/A",
                name: "",
                year: new Date().getFullYear(),
                published: false,
                archived: false,
                calendarToken,
                beerCalendars: [],
            });
        }
    }, [isFetchingCalendars, calendarsData, id, currentUser]);

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
