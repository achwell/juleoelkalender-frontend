import Filter from "@/components/table/filter/Filter";
import { Header, flexRender } from "@tanstack/react-table";
import clsx from "clsx";

interface Props<T> {
    header: Header<T, unknown>;
    small: boolean;
}

const TableHeader = <T,>({ header, small }: Props<T>) => {
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
                    <div
                        onClick={column.getToggleSortingHandler()}
                        className={clsx({ "cursor-pointer select-none": canSort })}
                    >
                        {flexRender(column.columnDef.header, header.getContext())}
                        {{
                            asc: " 🔼",
                            desc: " 🔽",
                        }[isSorted as string] ?? null}
                        <div
                            onDoubleClick={() => header.column.resetSize()}
                            onMouseDown={header.getResizeHandler()}
                            onTouchStart={header.getResizeHandler()}
                            className={clsx("resizer", { isResizing: header.column.getIsResizing() })}
                        />
                    </div>
                    {column.getCanFilter() ? (
                        <div>
                            <Filter column={column} />
                        </div>
                    ) : null}
                </>
            )}
        </th>
    );
};
export default TableHeader;
