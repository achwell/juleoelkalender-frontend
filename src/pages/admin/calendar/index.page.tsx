import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import Paragraph from "@/components/layout/Paragraph";
import AddBeerModal from "@/components/modals/AddBeerModal";
import CalendarBeersTable from "@/components/tables/CalendarBeersTable";
import { useGetBeersQuery } from "@/redux/api/beerApi";
import {
  MoveCalendar,
  useAddBeerCalendarMutation,
  useGetBeerCalendarsQuery,
  useMoveBeerCalendarsMutation,
} from "@/redux/api/beerCalendarApi";
import { useGetCalendarQuery, useGetCalendarsQuery, useGetCalendarWithBeersQuery } from "@/redux/api/calendarApi";
import ButtonProps, { ButtonType } from "@/types/ButtonProps";
import { Beer, BeerCalendar, CalendarWithBeer, RoleName } from "@/types/generated";
import { findFirstAvailableDay, handleErrorWithStatus } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

const CalendarDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: allBeerCalendars, refetch: refetchBeerCalendars } = useGetBeerCalendarsQuery();
  const { refetch: refetchCalendars } = useGetCalendarsQuery();
  const { data: calendar, isFetching: isFetchingCalendar, refetch: refetchCalendar } = useGetCalendarQuery(id ?? "");
  const [addBeerCalendarRequest, { isLoading: isAddingBeerCalendar }] = useAddBeerCalendarMutation();
  const addBeerCalendar = async (...args: Parameters<typeof addBeerCalendarRequest>) => {
    const result = await addBeerCalendarRequest(...args);

    if ("data" in result && result.data) {
      setShowAddDialog(false);
      refreshData().then(() => {
        toast.success(
          t("pages.calendar.admin.beeradded", {
            year: calendar?.year,
            calendar: calendar?.name,
            day: result.data?.day,
          }),
        );
      });
    } else if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
    }

    return result;
  };

  const [moveBeerCalendarsRequest] = useMoveBeerCalendarsMutation();
  const moveBeerCalendars = async (...args: Parameters<typeof moveBeerCalendarsRequest>) => {
    const result = await moveBeerCalendarsRequest(...args);

    if ("data" in result) {
      refreshData();
    } else if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
    }

    return result;
  };

  const { data: allBeers, refetch: refetchBeers } = useGetBeersQuery();

  const { data: cwb, refetch: refetchCwb } = useGetCalendarWithBeersQuery(id ?? "");

  const move = async (data: MoveCalendar) => {
    await moveBeerCalendars(data);
  };

  const addBeer = (beerCalendar: BeerCalendar) => {
    if (!calendar) {
      return;
    }
    const days = calendar.beerCalendars ? calendar.beerCalendars.map((bc) => bc.day) : [];
    if (beerCalendar.day && days.includes(beerCalendar.day)) {
      toast.error(
        t("pages.calendar.admin.itsalreadyabeeronday", {
          day: beerCalendar.day,
        }),
      );
      setShowAddDialog(false);
      return;
    }
    addBeerCalendar(beerCalendar);
  };

  const [openedAt] = useState(() => new Date());
  const occupiedDays = calendar?.beerCalendars?.map((bc) => bc.day) ?? [];
  const initialDay = findFirstAvailableDay(occupiedDays);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const refreshData = async () => {
    await refetchCalendar();
    await refetchCalendars();
    await refetchBeerCalendars();
    await refetchBeers();
    await refetchCwb();
  };

  useEffect(() => {
    if (!calendar && !isFetchingCalendar) navigate("/404");
  }, [calendar, isFetchingCalendar, navigate]);

  const { calendarWithBeers, availableBeers } = useMemo<{
    calendarWithBeers: CalendarWithBeer[];
    availableBeers: Beer[];
  }>(() => {
    if (!calendar || !cwb || !allBeers) return { calendarWithBeers: [], availableBeers: [] };
    const beers = Array.from({ length: 24 }, (_, index) => index)
      .map((day) => {
        const beer: Beer = {
          id: "N/A",
          name: "N/A",
          archived: false,
          bottleDate: openedAt,
          brewedDate: openedAt,
          createdDate: openedAt,
          brewer: {
            id: "N/A",
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: {
              id: "",
              name: RoleName.ROLE_USER,
              authorities: [],
              authority: RoleName.ROLE_USER,
            },
            calendarToken: [],
            createdDate: openedAt,
            locked: false,
            imageSilhouette: false,
          },
          reviews: [],
          style: "",
          desiredDate: undefined,
          description: "",
          abv: 0,
          ibu: 0,
          ebc: 0,
          recipe: undefined,
          untapped: undefined,
        };
        return {
          ...calendar,
          id: "N/A",
          day: day + 1,
          beer,
        };
      })
      .map((value) => {
        const day = value.day;
        const existingBeer = cwb.find((c) => c.day === day);
        return existingBeer ?? value;
      });
    const calendars = [...beers];
    calendars.sort((a, b) => a.day - b.day);
    const taken = new Set(
      calendars
        .map((value) => value.beer.id)
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index),
    );
    const ab = allBeers
      .filter((value) => !value.archived)
      .filter((value) => !taken.has(value.id))
      .toSorted((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    return { calendarWithBeers: calendars, availableBeers: ab };
  }, [calendar, cwb, allBeers, openedAt]);

  const buttons: ButtonProps[] = [
    {
      onClick: async () => await navigate("/calendar/"),
      icon: ButtonType.BACK,
      text: t("buttons.back"),
    },
  ];
  if (availableBeers.length > 0 && calendar?.beerCalendars && calendar.beerCalendars.length < 24) {
    buttons.push({
      text: t("pages.calendar.admin.addbeer"),
      onClick: () => setShowAddDialog(true),
      variant: "contained",
      icon: ButtonType.NEW,
    });
  }
  buttons.push({
    text: t("buttons.edit"),
    onClick: async () => await navigate(`/admin/calendar/edit/${calendar?.id}`),
    variant: "contained",
    icon: ButtonType.EDIT,
  });

  if (!id || !calendar || isFetchingCalendar) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <AddBeerModal
        beers={availableBeers}
        occupiedDays={occupiedDays}
        initialDay={initialDay}
        calendar={calendar}
        isAddingBeerCalendar={isAddingBeerCalendar}
        show={showAddDialog}
        hide={async () => {
          setShowAddDialog(false);
          await refreshData();
        }}
        callback={addBeer}
      />
      <H1>
        {t("pages.calendar.admin.header", {
          year: calendar?.year,
          calendar: calendar?.name,
        })}
      </H1>
      <Paragraph>{t("pages.calendar.admin.subheader", { calendar: calendar?.name })}</Paragraph>
      <ul>
        <li>
          {t("pages.calendar.admin.ispublished")}: {calendar?.published ? t("common.yes") : t("common.no")}
        </li>
        <li>
          {t("pages.calendar.admin.isarchived")}: {calendar?.archived ? t("common.yes") : t("common.no")}
        </li>
      </ul>
      <CalendarBeersTable
        data={calendarWithBeers}
        allBeers={allBeers ?? []}
        allBeerCalendars={allBeerCalendars ?? []}
        buttons={buttons}
        calendar={calendar}
        refreshData={refreshData}
        moveBeerCalendars={move}
      />
    </>
  );
};
export default CalendarDetailsPage;
