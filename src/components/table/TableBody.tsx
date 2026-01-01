import { Table, flexRender } from "@tanstack/react-table";
import clsx from "clsx";

interface Props<T> {
    table: Table<T>;
    small: boolean;
}

const TableBody = <T,>({ table, small }: Props<T>) => {
    return (
        <tbody>
            {table.getRowModel().rows.map((row) => {
                const width = small ? 0.5 : 1;
                return (
                    <tr key={`row-${row.id}`}>
                        {row.getVisibleCells().map((cell) => (
                            <td
                                key={`cell-${cell.id}`}
                                className={clsx("border border-solid border-gray-300 px-4")}
                                {...{
                                    ...{
                                        style: {
                                            width: `calc(var(--col-${cell.column.id}-size) * ${width}px)`,
                                        },
                                    },
                                }}
                            >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    );
};
export default TableBody;
