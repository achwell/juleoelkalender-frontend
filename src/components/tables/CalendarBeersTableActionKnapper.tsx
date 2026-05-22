import ActionKnapper from "@/components/ActionKnapper";
import { MoveCalendar } from "@/redux/api/beerCalendarApi";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { Beer, Calendar, Direction } from "@/types/generated";
import { hasAuthority } from "@/utils";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface Props {
  id: string;
  beerId: string;
  calendar: Calendar;
  day: number;
  moveBeerCalendars: (data: MoveCalendar) => Promise<void>;
  allBeers: Beer[];
  setBeer: (value: ((prevState: Beer | undefined) => Beer | undefined) | Beer | undefined) => void;
  setShowDeleteDialog: (value: ((prevState: boolean) => boolean) | boolean) => void;
  refreshData: () => Promise<void>;
}

const CalendarBeersTableActionKnapper: FC<Props> = ({
  id,
  beerId,
  calendar,
  day,
  moveBeerCalendars,
  allBeers,
  setBeer,
  setShowDeleteDialog,
  refreshData,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.authState);

  const fjernOel = (bId: string) => {
    if (allBeers) {
      const beer = allBeers.find((b) => b.id === bId);
      setBeer(beer);
      if (beer) {
        setShowDeleteDialog(true);
      }
    }
  };

  const flyttOpp = (calendarId: string, dayNumber: number) => {
    moveBeerCalendars({
      calendarId,
      day: dayNumber,
      direction: Direction.UP,
    }).then(async () => await refreshData());
  };

  const flyttNed = (calendarId: string, dayNumber: number) => {
    moveBeerCalendars({
      calendarId,
      day: dayNumber,
      direction: Direction.DOWN,
    }).then(async () => await refreshData());
  };

  return (
    <ActionKnapper
      key={`renderRowActions-${beerId}`}
      id={`renderRowActions-${beerId}`}
      buttons={[
        {
          icon: ButtonType.VIEW,
          text: t("buttons.details"),
          onClick: async () => await navigate(`/beers/details/${beerId}?from=/admin/calendar/${calendar.id}`),
        },
        {
          icon: ButtonType.DELETE,
          text: t("buttons.delete"),
          color: "error",
          variant: "text",
          hidden: !currentUser || !hasAuthority(currentUser, "beercalendar:delete"),
          onClick: () => fjernOel(beerId),
        },
        {
          icon: ButtonType.UP,
          text: t("buttons.move.up"),
          variant: "text",
          disabled: day === 1,
          hidden: !currentUser || !hasAuthority(currentUser, "beercalendar:update"),
          onClick: day === 1 ? undefined : () => flyttOpp(id, day),
        },
        {
          icon: ButtonType.DOWN,
          text: t("buttons.move.down"),
          variant: "text",
          disabled: day === 24,
          hidden: !currentUser || !hasAuthority(currentUser, "beercalendar:update"),
          onClick: day === 24 ? undefined : () => flyttNed(id, day),
        },
      ]}
    />
  );
};
export default CalendarBeersTableActionKnapper;
