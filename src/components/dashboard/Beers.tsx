import Paragraph from "@/components/layout/Paragraph";
import { Beer } from "@/types/generated";
import { format } from "date-fns-tz";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const Beers: FC<{
    numberOfBeers: number;
    numberOfBeersToPlace: number;
    newestBeer: Beer | null;
    numberOfVacantCalendarDays: number;
}> = ({ numberOfBeers, numberOfBeersToPlace, newestBeer, numberOfVacantCalendarDays }) => {
    const { t } = useTranslation();
    const createdDate = newestBeer?.createdDate;
    return (
        <>
            <Paragraph>
                {t("pages.dashboard.beers.total")}: {numberOfBeers}
            </Paragraph>
            <Paragraph>
                {t("pages.dashboard.beers.unplaced")}: {numberOfBeersToPlace}
            </Paragraph>
            <Paragraph>
                {t("pages.dashboard.beers.freecallendardays")}: {numberOfVacantCalendarDays}
            </Paragraph>
            {newestBeer && (
                <Paragraph>
                    {t("pages.dashboard.beers.newest")}: {newestBeer?.name}
                </Paragraph>
            )}
            {createdDate && (
                <Paragraph>
                    {t("pages.dashboard.beers.newestcreated")}: {format(createdDate, t("common.dateformat"))}
                </Paragraph>
            )}
        </>
    );
};
export default Beers;
