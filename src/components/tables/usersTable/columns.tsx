import CellItem from "@/components/table/cells/CellItem";
import DateCellItem from "@/components/table/cells/DateCellItem";
import ImageCellItem from "@/components/table/cells/ImageCellItem";
import FilterVariant from "@/components/table/filter/FilterVariant";
import Meta from "@/components/table/filter/Meta";
import UserTableAction from "@/components/tables/usersTable/UserTableAction";
import { CalendarToken, Role, User } from "@/types/generated";
import { getNameOfUser, getRoleDescription } from "@/utils";
import { FilterFn, Row, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns-tz";

const columns = (
    t: (key: string) => string,
    users: User[],
    canSeeLastLogin: boolean,
    currentUser: User | undefined,
    viewUser: (user: User) => void,
    showDeleteUser: (user: User) => void,
    unlock: (user: User) => void
) => {
    const dateformat = t("common.dateformat");
    const isPassive = (calendarToken: CalendarToken[]) => {
        return calendarToken.filter((c) => c.active).length < 1;
    };
    const roleFilterFn = <TData extends User>(row: Row<TData>, columnId: string, filterValue: string) => {
        const roleObj = row.getValue<Role>(columnId);
        const roles = filterValue
            .toUpperCase()
            .split(",")
            .filter((r) => !!r && r !== "");
        return roles.includes(roleObj.name);
    };
    const dateFilterFn = <TData extends User>(row: Row<TData>, columnId: string, filterValue: string) => {
        const cell = row.getValue<Date | undefined>(columnId);
        return cell == null ? false : format(cell, dateformat).includes(filterValue);
    };
    const arrayLengthFilter: FilterFn<User> = (row, columnId, filterValue) => {
        // @ts-ignore
        const rowValue: number = row.getValue(columnId).length ?? 0;
        const [min, max] = filterValue;
        const minVal = min ? min : undefined;
        const maxVal = max ? Number(max) : undefined;

        if (!maxVal && !minVal) return true;
        if (maxVal && minVal) return rowValue >= minVal && rowValue <= maxVal;
        if (maxVal) return rowValue <= maxVal;
        if (minVal) return rowValue >= minVal;
        return true;
    };
    roleFilterFn.autoRemove = (val: any) => !val;
    roleFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim();
    dateFilterFn.autoRemove = (val: any) =>
        val === undefined || val === null || (typeof val === "string" && val.trim() === "");
    dateFilterFn.resolveFilterValue = (val: any) => (typeof val === "string" ? val.trim() : val);
    arrayLengthFilter.autoRemove = (val: any) => val === undefined || val === null;
    arrayLengthFilter.resolveFilterValue = (val: any) => (typeof Array.isArray(val) ? val : [0, undefined]);

    const metaRole: Meta = { filterVariant: FilterVariant.role };
    const metaBeers: Meta = {
        filterVariant: FilterVariant.range,
        minValue: 0,
        maxValue: users.reduce((max, user) => {
            const count = user.beers.length;
            return count > max ? count : max;
        }, 0),
    };

    const columnHelper = createColumnHelper<User>();
    return [
        columnHelper.accessor("firstName", {
            header: t("pages.users.name"),
            cell: (info) => {
                const row = info.row.original;
                return (
                    <CellItem locked={row.locked} passive={isPassive(row.calendarToken)} value={getNameOfUser(row)} />
                );
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("email", {
            header: t("pages.users.email"),
            cell: (info) => {
                const { locked, email, calendarToken } = info.row.original;
                return (
                    <CellItem
                        locked={locked}
                        passive={isPassive(calendarToken)}
                        value={<a href={`mailto:${email}`}>{email}</a>}
                    />
                );
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("area", {
            header: t("pages.users.area"),
            cell: (info) => {
                const { locked, calendarToken, area } = info.row.original;
                return <CellItem locked={locked} passive={isPassive(calendarToken)} value={area} />;
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("role", {
            header: t("pages.users.role"),
            cell: (info) => {
                const {
                    locked,
                    role: { name },
                    calendarToken,
                } = info.row.original;
                return (
                    <CellItem locked={locked} passive={isPassive(calendarToken)} value={getRoleDescription(t, name)} />
                );
            },
            filterFn: roleFilterFn,
            meta: metaRole,
        }),
        columnHelper.accessor("beers", {
            header: t("pages.users.numberofbeers"),
            cell: (info) => {
                const { locked, calendarToken, beers } = info.row.original;
                return <CellItem locked={locked} passive={isPassive(calendarToken)} value={beers ? beers.length : 0} />;
            },
            filterFn: arrayLengthFilter,
            meta: metaBeers,
        }),
        columnHelper.accessor("createdDate", {
            header: t("pages.users.created"),
            enableHiding: !canSeeLastLogin,
            cell: (info) => {
                const { locked, calendarToken, createdDate } = info.row.original;
                return (
                    <DateCellItem
                        locked={locked}
                        passive={isPassive(calendarToken)}
                        value={createdDate}
                        dateformat={dateformat}
                    />
                );
            },
            filterFn: dateFilterFn,
            enableColumnFilter: true,
        }),
        columnHelper.accessor("lastLoginDate", {
            header: t("pages.users.lastlogin"),
            enableHiding: !canSeeLastLogin,
            cell: (info) => {
                const { locked, calendarToken, lastLoginDate } = info.row.original;
                return (
                    <DateCellItem
                        locked={locked}
                        passive={isPassive(calendarToken)}
                        value={lastLoginDate}
                        dateformat={dateformat}
                    />
                );
            },
            filterFn: dateFilterFn,
            enableColumnFilter: true,
        }),
        columnHelper.accessor("imageUrl", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <ImageCellItem
                        locked={row.locked}
                        passive={isPassive(row.calendarToken)}
                        src={row.imageUrl}
                        height={row.imageHeight}
                        width={row.imageWidth}
                        alt={getNameOfUser(row)}
                    />
                );
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
        columnHelper.accessor("id", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <UserTableAction
                        user={row}
                        currentUser={currentUser}
                        viewUser={viewUser}
                        showDeleteUser={showDeleteUser}
                        unlock={unlock}
                    />
                );
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
    ];
};
export default columns;
