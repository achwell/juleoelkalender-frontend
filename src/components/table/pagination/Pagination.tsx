import IconFirst from "@/components/table/pagination/IconFirst";
import IconLast from "@/components/table/pagination/IconLast";
import IconNext from "@/components/table/pagination/IconNext";
import IconPrevious from "@/components/table/pagination/IconPrevious";
import PaginationButton from "@/components/table/pagination/PaginationButton";
import { Table } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

interface Props<T> {
    table: Table<T>;
}

const Pagination = <T,>({ table }: Props<T>) => {
    const { t } = useTranslation();
    const rowCount = table.getPrePaginationRowModel().rows.length;
    const { pageSize, pageIndex } = table.getState().pagination;
    const firstRow = pageIndex * pageSize + 1;
    const lastRow = Math.min((pageIndex + 1) * pageSize, rowCount);

    if (table.getPageCount() < 2) {
        return null;
    }

    return (
        <nav className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
                <PaginationButton onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} small={true}>
                    <IconFirst />
                </PaginationButton>
                <PaginationButton
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    small={true}
                >
                    <IconPrevious />
                </PaginationButton>
                <PaginationButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} small={true}>
                    <IconNext />
                </PaginationButton>
                <PaginationButton onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} small={true}>
                    <IconLast />
                </PaginationButton>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        {t("table.pagination.showingresults", { firstRow, lastRow, rowCount })}
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <div className="px-2">
                            <PaginationButton onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
                                <span className="sr-only">{t("table.pagination.first")}</span>
                                <IconFirst />
                            </PaginationButton>
                            <PaginationButton
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">{t("table.pagination.previous")}</span>
                                <IconPrevious />
                            </PaginationButton>
                            <PaginationButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                                <span className="sr-only">{t("table.pagination.next")}</span>
                                <IconNext />
                            </PaginationButton>
                            <PaginationButton onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
                                <span className="sr-only">{t("table.pagination.last")}</span>
                                <IconLast />
                            </PaginationButton>
                        </div>
                        <span className="text-sm text-gray-700">
                            <span className="px-2">{t("table.pagination.rowsperpage")}</span>
                            <select
                                value={table.getState().pagination.pageSize}
                                onChange={(e) => {
                                    table.setPageSize(Number(e.target.value));
                                }}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <option key={pageSize} value={pageSize}>
                                        {pageSize}
                                    </option>
                                ))}
                            </select>
                        </span>
                    </nav>
                </div>
            </div>
        </nav>
    );
};
export default Pagination;
