import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import Table from "@/components/table/Table";
import { useGetBeersWithCalendarQuery } from "@/redux/api/beerApi";
import BeerWithCalendar from "@/types/BeerWithCalendar";
import { ButtonType } from "@/types/ButtonProps";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const MyCalendarsTable = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: beers } = useGetBeersWithCalendarQuery();
    const mybeers = beers ? beers.filter((beer) => !!beer.calendar) : [];

    const columnHelper = createColumnHelper<BeerWithCalendar>();
    const columns = [
        columnHelper.accessor("calendar.year", {
            header: t("mycalendarstable.year"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("calendar.name", {
            header: t("mycalendarstable.calendar"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("day", {
            header: t("mycalendarstable.dayincalendar"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.name", {
            header: t("mycalendarstable.beername"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.desiredDate", {
            header: t("mycalendarstable.desiredday"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("calendar.id", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <ActionKnapper
                        key={`renderRowActions-${row.calendar.id}`}
                        id={`renderRowActions-${row.calendar.id}`}
                        buttons={[
                            {
                                icon: ButtonType.VIEW,
                                text: t("mycalendarstable.viewallbeers"),
                                onClick: () => navigate(`/calendar/${row.calendar.id}`),
                            },
                        ]}
                    />
                );
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
    ];
    if (!mybeers || !columns) return <FullScreenLoader />;
    return <Table data={mybeers} cols={columns} />;
};
export default MyCalendarsTable;
