import { Subscribe } from "@tanstack/react-table";
import type { RowData } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { Table } from "@/components/table/tableTypes";
import { clsx } from "clsx";

interface Props<T extends RowData> {
  table: Table<T>;
  small: boolean;
}

const TableBody = <T extends RowData>({ table, small }: Props<T>) => {
  return (
    <Subscribe source={table.store} selector={(state) => state}>
      {() => {
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
                        style: {
                          width: `calc(var(--col-${cell.column.id}-size) * ${width}px)`,
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
      }}
    </Subscribe>
  );
};
export default TableBody;
