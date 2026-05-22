import ActionKnapper from "@/components/ActionKnapper";
import { useAppSelector } from "@/redux/hooks";
import BeerDetails from "@/types/BeerDetails";
import { ButtonType } from "@/types/ButtonProps";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface Props {
  row: BeerDetails;
  setBeer: (value: ((prevState: BeerDetails | undefined) => BeerDetails | undefined) | BeerDetails | undefined) => void;
  setOpen: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const BeerTableActionKnapper: FC<Props> = ({ row, setBeer, setOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.authState);
  return (
    <ActionKnapper
      key={`renderRowActions-${row.beer.id}`}
      id={`renderRowActions-${row.beer.id}`}
      buttons={[
        {
          icon: ButtonType.VIEW,
          text: t("pages.calendarview.beer.details"),
          onClick: () => {
            setBeer(row);
            setOpen(true);
          },
        },
        {
          icon: row.review ? ButtonType.EDIT : ButtonType.NEW,
          text: row.review ? t("pages.calendar.review.editvote") : t("pages.calendar.review.addvote"),
          onClick: async () => await navigate(`/calendar/${row.calendarId}/${row.beer.id}`),
          hidden: row.beer.brewer.id === currentUser?.id,
        },
      ]}
    />
  );
};
export default BeerTableActionKnapper;
