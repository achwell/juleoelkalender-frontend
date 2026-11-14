import { Subscribe } from "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";
import Filter from "@/components/table/filter/Filter";
import { flexRender } from "@tanstack/react-table";
import { Header } from "@/components/table/tableTypes";
import { clsx } from "clsx";

interface Props<T extends RowData> {
  header: Header<T, unknown>;
  small: boolean;
}

const TableHeader = <T extends RowData>({ header, small }: Props<T>) => {
  return (
    <Subscribe source={header.table.store} selector={(state) => state}>
      {() => {
        const { id, colSpan, isPlaceholder, column } = header;
        const canSort = column.getCanSort();
        const isSorted = column.getIsSorted();
        const width = small ? 0.5 : 1;

        return (
          <th
            key={id}
            colSpan={colSpan}
            className={clsx("border border-solid border-gray-300 p-4 text-left")}
            {...{
              style: {
                width: `calc(var(--header-${header?.id}-size) * ${width}px)`,
              },
            }}
          >
            {isPlaceholder ? null : (
              <>
                <button
                  type="button"
                  onClick={column.getToggleSortingHandler()}
                  className={clsx({ "cursor-pointer select-none": canSort })}
                >
                  {flexRender(column.columnDef.header, header.getContext())}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[isSorted as string] ?? null}
                </button>
                <button
                  type="button"
                  aria-label="Resize column"
                  onDoubleClick={() => header.column.resetSize()}
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                  className={clsx("resizer", { isResizing: header.column.getIsResizing() })}
                />
                {column.getCanFilter() ? (
                  <div>
                    <Filter column={column} />
                  </div>
                ) : null}
              </>
            )}
          </th>
        );
      }}
    </Subscribe>
  );
};
export default TableHeader;
