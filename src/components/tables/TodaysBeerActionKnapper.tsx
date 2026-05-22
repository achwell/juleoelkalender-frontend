import ActionKnapper from "@/components/ActionKnapper";
import { useAppSelector } from "@/redux/hooks";
import BeerDetails from "@/types/BeerDetails";
import BeerWithCalendarAndDayAndReview from "@/types/BeerWithCalendarAndDayAndReview";
import { ButtonType } from "@/types/ButtonProps";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface Props {
  row: BeerWithCalendarAndDayAndReview;
  setBeer: (value: ((prevState: BeerDetails | undefined) => BeerDetails | undefined) | BeerDetails | undefined) => void;
  setOpen: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const TodaysBeerActionKnapper: FC<Props> = ({ row, setBeer, setOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.authState);
  const { beer, calendar, day, review } = row;
  return (
    <ActionKnapper
      key={`renderRowActions-${beer.id}`}
      id={`renderRowActions-${beer.id}`}
      buttons={[
        {
          icon: ButtonType.VIEW,
          text: t("mybeerstable.details"),
          variant: "text",
          color: "primary",
          onClick: () => {
            if (calendar?.id) {
              setBeer({
                beer: beer,
                calendarId: calendar.id,
                day,
                review,
              });
              setOpen(true);
            }
          },
        },
        {
          icon: review ? ButtonType.EDIT : ButtonType.NEW,
          text: review ? t("pages.calendar.review.editvote") : t("pages.calendar.review.addvote"),
          variant: "text",
          color: "secondary",
          onClick: async () => await navigate(`/calendar/${calendar.id}/${beer.id}?from=/`),
          hidden: beer.brewer.id === currentUser?.id,
        },
      ]}
    />
  );
};
export default TodaysBeerActionKnapper;
