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
import { useGetCalendarQuery, useGetCalendarWithBeersQuery, useGetCalendarsQuery } from "@/redux/api/calendarApi";
import ButtonProps, { ButtonType } from "@/types/ButtonProps";
import { Beer, BeerCalendar, CalendarWithBeer, NameEnum } from "@/types/generated";
import { findFirstAvailableDay, handleError } from "@/utils";
import { useEffect, useState } from "react";
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
    const [
        addBeerCalendar,
        {
            isLoading: isAddingBeerCalendar,
            isSuccess: isSuccessAdding,
            data: dataAdding,
            isError: isErrorAdding,
            error: errorAdding,
        },
    ] = useAddBeerCalendarMutation();
    const [
        moveBeerCalendars,
        { isLoading: isMovingBeerCalendar, isSuccess: isSuccessMoving, isError: isErrorMoving, error: errorMoving },
    ] = useMoveBeerCalendarsMutation();

    const { data: allBeers, refetch: refetchBeers } = useGetBeersQuery();

    const { data: cwb, isFetching: isFetchingCW, refetch: refetchCwb } = useGetCalendarWithBeersQuery(id ?? "");

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
                })
            );
            setShowAddDialog(false);
            return;
        }
        addBeerCalendar(beerCalendar);
    };

    const [calendarWithBeers, setCalendarWithBeers] = useState<CalendarWithBeer[]>([]);
    const [availableBeers, setAvailableBeers] = useState<Beer[]>([]);
    const [occupiedDays, setOccupiedDays] = useState<number[]>([]);
    const [initialDay, setInitialDay] = useState(1);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const refreshData = async () => {
        await refetchCalendar();
        await refetchCalendars();
        await refetchBeerCalendars();
        await refetchBeers();
        await refetchCwb();
    };

    useEffect(() => {
        setInitialDay(findFirstAvailableDay(occupiedDays));
    }, [occupiedDays]);

    useEffect(() => {
        if (!isAddingBeerCalendar) {
            if (isSuccessAdding && dataAdding) {
                setShowAddDialog(false);
                refreshData().then(() => {
                    toast.success(
                        t("pages.calendar.admin.beeradded", {
                            year: calendar?.year,
                            calendar: calendar?.name,
                            day: dataAdding.day,
                        })
                    );
                });
            } else if (isErrorAdding && errorAdding) {
                handleError(t, errorAdding);
            }
        }
    }, [isAddingBeerCalendar]);

    useEffect(() => {
        if (!isMovingBeerCalendar) {
            if (isSuccessMoving) {
                refreshData();
            } else if (isErrorMoving && errorMoving) {
                handleError(t, errorMoving);
            }
        }
    }, [isMovingBeerCalendar]);

    useEffect(() => {
        if (!calendar) {
            if (!isFetchingCalendar) {
                navigate("/404");
            }
        } else if (cwb && allBeers) {
            const beers = Array.from(Array(24).keys())
                .map((day) => {
                    const beer: Beer = {
                        id: "N/A",
                        name: "N/A",
                        archived: false,
                        bottleDate: new Date(),
                        brewedDate: new Date(),
                        createdDate: new Date(),
                        brewer: {
                            id: "N/A",
                            firstName: "",
                            lastName: "",
                            email: "",
                            password: "",
                            role: {
                                id: "",
                                name: NameEnum.ROLE_USER,
                                authorities: [],
                                authority: NameEnum.ROLE_USER,
                            },
                            calendarToken: [],
                            createdDate: new Date(),
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
                    const existingBeer = cwb.filter((c) => c.day === day).at(0);
                    return existingBeer ?? value;
                });
            const calendars = [...beers];
            calendars.sort((a, b) => a.day - b.day);
            setCalendarWithBeers(calendars);
            const taken = calendars
                .map((value) => value.beer.id)
                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);
            const ab = allBeers
                .filter((value) => !value.archived)
                .filter((value) => !taken.includes(value.id))
                .sort((a, b) => {
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
            setAvailableBeers(ab);
            setOccupiedDays(calendar.beerCalendars ? calendar.beerCalendars.map((bc) => bc.day) : []);
        }
    }, [calendar, isFetchingCalendar, isFetchingCW, cwb, allBeers, navigate]);

    const buttons: ButtonProps[] = [
        {
            onClick: () => navigate("/calendar/"),
            icon: ButtonType.BACK,
            text: t("buttons.back"),
        },
    ];
    if (availableBeers.length > 0 && calendar && calendar.beerCalendars && calendar.beerCalendars.length < 24) {
        buttons.push({
            text: t("pages.calendar.admin.addbeer"),
            onClick: () => setShowAddDialog(true),
            variant: "contained",
            icon: ButtonType.NEW,
        });
    }
    buttons.push({
        text: t("buttons.edit"),
        onClick: () => navigate(`/admin/calendar/edit/${calendar?.id}`),
        variant: "contained",
        icon: ButtonType.EDIT,
    });

    if (!id || !calendar || isFetchingCalendar) return <FullScreenLoader />;

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
