import ActionKnapper from "@/components/ActionKnapper";
import RemoveBeerModal from "@/components/modals/RemoveBeerModal";
import Table from "@/components/table/Table";
import { MoveCalendar, useDeleteBeerCalendarMutation } from "@/redux/api/beerCalendarApi";
import { useAppSelector } from "@/redux/hooks";
import ButtonProps, { ButtonType } from "@/types/ButtonProps";
import { Beer, BeerCalendar, Calendar, CalendarWithBeer, Direction } from "@/types/generated";
import { handleError, hasAuthority } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CalendarBeersTable: FC<{
    data: CalendarWithBeer[];
    allBeers: Beer[];
    allBeerCalendars: BeerCalendar[];
    buttons: ButtonProps[];
    calendar: Calendar;
    refreshData: () => Promise<void>;
    moveBeerCalendars: (data: MoveCalendar) => Promise<void>;
}> = ({ data, allBeers, allBeerCalendars, buttons, calendar, refreshData, moveBeerCalendars }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.authState);
    const [
        deleteBeerCalendar,
        {
            isLoading: isDeletingBeerCalendar,
            isSuccess: isSuccessDeleting,
            isError: isErrorDeleting,
            error: errorDeleting,
        },
    ] = useDeleteBeerCalendarMutation();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [beer, setBeer] = useState<Beer>();

    useEffect(() => {
        if (isDeletingBeerCalendar) {
            if (isSuccessDeleting) {
                setShowDeleteDialog(false);
                refreshData().then(() => {
                    toast.success(
                        t("pages.calendar.admin.beerremoved", {
                            beer: beer?.name,
                            year: calendar?.year,
                            calendar: calendar?.name,
                        })
                    );
                });
            } else if (isErrorDeleting && errorDeleting) {
                handleError(t, errorDeleting);
            }
        }
    }, [isDeletingBeerCalendar]);

    const deleteBeer = async () => {
        if (calendar && beer && allBeerCalendars) {
            const beerCaledar = allBeerCalendars
                .filter((bc) => !!bc.calendar && bc.calendar.id === calendar.id && bc.beer.id === beer.id)
                .at(0);
            if (beerCaledar?.id) {
                deleteBeerCalendar(beerCaledar.id);
            }
            setShowDeleteDialog(false);
        }
    };

    const fjernOel = (beerId: string) => {
        if (allBeers) {
            const b = allBeers.filter((b) => b.id === beerId).at(0);
            setBeer(b);
            if (b) {
                setShowDeleteDialog(true);
            }
        }
    };

    const flyttOpp = (calendarId: string, day: number) => {
        moveBeerCalendars({
            calendarId,
            day,
            direction: Direction.UP,
        }).then(async () => await refreshData());
    };

    const flyttNed = (calendarId: string, day: number) => {
        moveBeerCalendars({
            calendarId,
            day,
            direction: Direction.DOWN,
        }).then(async () => await refreshData());
    };

    const columnHelper = createColumnHelper<CalendarWithBeer>();
    const columns = [
        columnHelper.accessor("day", {
            header: t("pages.calendarview.beer.day"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.name", {
            header: t("beer.name"),
            cell: (info) => {
                const {
                    beer: { id, name },
                } = info.row.original;
                return id === "N/A" ? "" : name;
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.style", {
            header: t("beer.style"),
            cell: (info) => {
                const {
                    beer: { id, style },
                } = info.row.original;
                return id === "N/A" ? "" : style;
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.abv", {
            header: t("beer.abv"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.ebc", {
            header: t("beer.ebc"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.ibu", {
            header: t("beer.ibu"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.brewer", {
            header: t("beer.brewer"),
            cell: (info) => {
                const {
                    beer: { id, brewer },
                } = info.row.original;
                return id === "N/A"
                    ? ""
                    : !!brewer
                      ? [brewer.firstName, brewer.middleName, brewer.lastName].filter((s) => !!s).join(" ")
                      : "";
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.id", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                const {
                    id,
                    beer: { id: beerId },
                    day,
                } = row;
                if (beerId === "N/A") return [];
                return (
                    <ActionKnapper
                        key={`renderRowActions-${beerId}`}
                        id={`renderRowActions-${beerId}`}
                        buttons={[
                            {
                                icon: ButtonType.VIEW,
                                text: t("buttons.details"),
                                onClick: () => navigate(`/beers/details/${beerId}?from=/admin/calendar/${calendar.id}`),
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
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
    ];

    if (!currentUser) return null;

    return (
        <>
            <RemoveBeerModal
                beerName={beer?.name}
                calendarName={calendar?.name}
                calendarYear={calendar?.year}
                isDeletingBeerCalendar={isDeletingBeerCalendar}
                show={showDeleteDialog}
                hide={() => setShowDeleteDialog(false)}
                callback={deleteBeer}
            />
            <Table
                data={data}
                cols={columns}
                defaultPagination={{ pageSize: 24, pageIndex: 0 }}
                actionButtons={<ActionKnapper buttons={buttons} />}
            />
        </>
    );
};
export default CalendarBeersTable;
