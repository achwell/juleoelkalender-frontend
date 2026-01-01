import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import Paragraph from "@/components/layout/Paragraph";
import Table from "@/components/table/Table";
import FilterVariant from "@/components/table/filter/FilterVariant";
import Meta from "@/components/table/filter/Meta";
import { useDeleteCalendarMutation, useGetCalendarsQuery } from "@/redux/api/calendarApi";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { Calendar } from "@/types/generated";
import { handleError, hasAuthority } from "@/utils";
import { FilterFn, createColumnHelper } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GiCheckMark } from "react-icons/gi";
import { MdOutlineBlock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const CalendarAdmin = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { data: calendars } = useGetCalendarsQuery();
    const { currentUser } = useAppSelector((state) => state.authState);
    const [
        deleteCalendar,
        { isLoading: isDeleting, isSuccess: isSuccessDeleting, isError: isErrorDeleting, error: errorDeleting },
    ] = useDeleteCalendarMutation();
    const { refetch } = useGetCalendarsQuery();

    const [showDelete, setShowDelete] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState<Calendar>();

    useEffect(() => {
        const finish = async () => {
            if (!isDeleting) {
                if (isSuccessDeleting && selectedCalendar) {
                    toast.success(
                        t("delete.deleted", {
                            deleted: selectedCalendar.name,
                        })
                    );
                    await refetch();
                } else if (isErrorDeleting && errorDeleting) {
                    handleError(t, errorDeleting);
                    await refetch();
                }
                setShowDelete(false);
                setSelectedCalendar(undefined);
            }
        };
        finish();
    }, [errorDeleting, isDeleting, isErrorDeleting, isSuccessDeleting, refetch]);

    useEffect(() => {
        if (selectedCalendar && selectedCalendar.id) {
            setShowDelete(true);
        }
    }, [selectedCalendar]);

    const archivedFilter: FilterFn<Calendar> = (row, columnId, filterValue) => {
        const rowValue = row.getValue(columnId);
        return filterValue === null || filterValue === undefined ? true : String(rowValue) !== filterValue;
    };

    const columnHelper = createColumnHelper<Calendar>();
    const metaPublished: Meta = { filterVariant: FilterVariant.publishedInverted };
    const metaArchived: Meta = { filterVariant: FilterVariant.activeInverted };
    const columns = [
        columnHelper.accessor("year", {
            header: t("pages.calendar.admin.year"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("published", {
            header: t("pages.calendar.admin.published"),
            cell: (info) => {
                return info.row.original.published ? (
                    <MdVisibility title={t("pages.calendar.admin.published")} />
                ) : (
                    <MdVisibilityOff title={t("pages.calendar.admin.hidden")} />
                );
            },
            enableColumnFilter: true,
            enableSorting: true,
            filterFn: archivedFilter,
            meta: metaPublished,
        }),
        columnHelper.accessor("archived", {
            header: t("pages.calendar.admin.archived"),
            cell: (info) => {
                return info.row.original.archived ? (
                    <MdOutlineBlock title={t("pages.calendar.admin.archived")} />
                ) : (
                    <GiCheckMark title={t("pages.calendar.admin.active")} />
                );
            },
            enableColumnFilter: true,
            enableSorting: true,
            filterFn: archivedFilter,
            meta: metaArchived,
        }),
        columnHelper.accessor("id", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <ActionKnapper
                        key={`renderRowActions-${row.id}`}
                        id={`renderRowActions-${row.id}`}
                        buttons={[
                            {
                                icon: ButtonType.EDIT,
                                text: t("buttons.edit"),
                                onClick: () => navigate(`/admin/calendar/${row.id}`),
                            },
                            {
                                icon: ButtonType.DELETE,
                                text: t("buttons.delete"),
                                color: "error",
                                variant: "text",
                                disabled: row.beerCalendars.length > 0,
                                onClick: () => showDeleteCalendar(row),
                            },
                        ]}
                    />
                );
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
    ];
    const showDeleteCalendar = (value: Calendar) => setSelectedCalendar(value);

    if (!calendars) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-items-center">
            <ModalDialog
                show={showDelete}
                hide={() => setShowDelete(false)}
                title={t("delete.delete", {
                    name: selectedCalendar?.name,
                })}
            >
                <p className="mt-2 mb-2 text-gray-500">
                    {t("delete.confirmdelete", {
                        name: selectedCalendar?.name,
                    })}
                </p>
                <ActionKnapper
                    buttons={[
                        {
                            onClick: () => deleteCalendar(selectedCalendar?.id ?? ""),
                            icon: ButtonType.DELETE,
                            text: isDeleting ? t("delete.deleting") : t("buttons.delete"),
                            disabled: isDeleting,
                        },
                        {
                            onClick: () => setShowDelete(false),
                            icon: ButtonType.CANCEL,
                            text: t("buttons.cancel"),
                        },
                    ]}
                />
            </ModalDialog>
            <Paragraph>{t("pages.calendar.admin.ingress")}</Paragraph>
            <Table
                data={calendars}
                cols={columns}
                actionButtons={
                    <ActionKnapper
                        buttons={[
                            {
                                text: t("pages.calendar.admin.addcalendar"),
                                variant: "contained",
                                icon: ButtonType.NEW,
                                hidden: !!currentUser && !hasAuthority(currentUser, "calendar:create"),
                                onClick: () => navigate("/admin/calendar/edit/new"),
                            },
                        ]}
                    />
                }
                disableGlobalFilters={true}
            />
        </div>
    );
};
export default CalendarAdmin;
