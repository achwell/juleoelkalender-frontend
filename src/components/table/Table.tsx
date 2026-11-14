import GlobalFilter from "@/components/table/filter/GlobalFilter";
import Pagination from "@/components/table/pagination/Pagination";
import TableBody from "@/components/table/TableBody";
import { features } from "@/components/table/tableFeatures";
import type { ColumnDef } from "@/components/table/tableTypes";
import THead from "@/components/table/THead";
import { type PaginationState, type RowData, useTable } from "@tanstack/react-table";
import { JSX } from "react";
import { useTranslation } from "react-i18next";

interface Props<T extends RowData> {
  data: T[];
  columns: ColumnDef<T, any>[];
  actionButtons?: JSX.Element;
  disableGlobalFilters?: boolean;
  defaultPagination?: PaginationState;
  small?: boolean;
}

const Table = <T extends RowData>({
  data,
  columns,
  actionButtons,
  disableGlobalFilters = false,
  defaultPagination = {
    pageIndex: 0,
    pageSize: 10,
  },
  small = false,
}: Props<T>) => {
  const { t } = useTranslation();
  const table = useTable({
    features,
    data,
    columns,
    defaultColumn: { minSize: 60, maxSize: 800 },
    initialState: { pagination: defaultPagination },
    autoResetPageIndex: false,
    columnResizeMode: "onChange",
    enableFilters: true,
    enableSorting: true,
    globalFilterFn: "fuzzy",
  });
  const { globalFilter } = table.state;

  const headers = table.getFlatHeaders();
  const colSizes: { [key: string]: number } = {};
  for (const element of headers) {
    const header = element;
    const { id, column } = header;
    const { id: columnId } = column;
    const size = header.getSize();
    const columnSize = column.getSize();
    colSizes[`--header-${id}-size`] = size * 1.2;
    colSizes[`--col-${columnId}-size`] = columnSize * 1.2;
  }
  return (
    <div>
      <div className="flex flex-row">
        {actionButtons}
        {!disableGlobalFilters && data.length > 0 && (
          <GlobalFilter globalFilter={String(globalFilter ?? "")} setGlobalFilter={table.setGlobalFilter} />
        )}
      </div>
      {data.length < 1 && <div>{t("table.norowstoshow")}</div>}
      {data.length > 0 && (
        <>
          <table
            {...{
              style: {
                ...colSizes, //Define column sizes on the <table> element
                width: table.getTotalSize() / (small ? 2 : 1),
              },
            }}
            className="divTable border-collapse my-4 w-full table-auto"
          >
            <THead headerGroups={table.getHeaderGroups() ?? []} small={small} />
            <TableBody table={table} small={small} />
          </table>
          <Pagination table={table} />
        </>
      )}
    </div>
  );
};
export default Table;
