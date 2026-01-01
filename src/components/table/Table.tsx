import THead from "@/components/table/THead";
import TableBody from "@/components/table/TableBody";
import GlobalFilter from "@/components/table/filter/GlobalFilter";
import Pagination from "@/components/table/pagination/Pagination";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
    AccessorKeyColumnDefBase,
    ColumnFiltersState,
    FilterFn,
    IdIdentifier,
    PaginationState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { JSX, memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

declare module "@tanstack/react-table" {
    //add fuzzy filter to the filterFns
    interface FilterFns {
        fuzzy: FilterFn<unknown>;
    }

    interface FilterMeta {
        itemRank: RankingInfo;
    }
}

type ColType<T> = AccessorKeyColumnDefBase<T, any> & Partial<IdIdentifier<T, any>>;

interface Props<T> {
    data: T[];
    cols: ColType<T>[];
    actionButtons?: JSX.Element;
    disableGlobalFilters?: boolean;
    defaultPagination?: PaginationState;
    small?: boolean;
}

const Table = <T,>({
    data,
    cols,
    actionButtons,
    disableGlobalFilters = false,
    defaultPagination = {
        pageIndex: 0,
        pageSize: 10,
    },
    small = false,
}: Props<T>) => {
    const { t } = useTranslation();
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState(defaultPagination);

    const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });
        return itemRank.passed;
    };

    // @ts-ignore
    const columns = useMemo<ColType<T, any>[]>(() => cols, []);

    const table = useReactTable({
        data,
        columns,
        defaultColumn: {
            minSize: 60,
            maxSize: 800,
        },
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
            pagination,
            sorting,
        },
        autoResetPageIndex: false,
        columnResizeMode: "onChange",
        debugColumns: false,
        debugHeaders: true,
        debugTable: true,
        enableFilters: true,
        enableSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        globalFilterFn: "fuzzy",
        manualPagination: false,
        manualSorting: false,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
    });

    const columnSizeVars = useMemo(() => {
        const headers = table.getFlatHeaders();
        const colSizes: { [key: string]: number } = {};
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i]!;
            const { id, column } = header;
            const { id: columnId } = column;
            const size = header.getSize();
            const columnSize = column.getSize();
            colSizes[`--header-${id}-size`] = size * 1.2;
            colSizes[`--col-${columnId}-size`] = columnSize * 1.2;
        }
        return colSizes;
    }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

    return (
        <div>
            <div className="flex flex-row">
                {actionButtons}
                {!disableGlobalFilters && data.length > 0 && (
                    <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                )}
            </div>
            {data.length < 1 && <div>{t("table.norowstoshow")}</div>}
            {data.length > 0 && (
                <>
                    <table
                        {...{
                            style: {
                                ...columnSizeVars, //Define column sizes on the <table> element
                                width: table.getTotalSize() / (small ? 2 : 1),
                            },
                        }}
                        className="divTable border-collapse my-4 w-full table-auto"
                    >
                        <THead headerGroups={table.getHeaderGroups() ?? []} small={small} />
                        {table.getState().columnSizingInfo.isResizingColumn ? (
                            <MemoizedTableBody table={table} small={small} />
                        ) : (
                            <TableBody table={table} small={small} />
                        )}
                    </table>
                    <Pagination table={table} />
                </>
            )}
        </div>
    );
};
export default Table;

export const MemoizedTableBody = memo(
    TableBody,
    (prev, next) => prev.table.options.data === next.table.options.data
) as typeof TableBody;
