import type { RowData } from "@tanstack/react-table";
import DebouncedInput from "@/components/table/filter/DebouncedInput";
import TextFunction from "@/types/TextFunction";
import { Column } from "@/components/table/tableTypes";

interface Props<T extends RowData> {
  t: TextFunction;
  column: Column<T>;
  filterValue?: unknown;
}

const NumberFilter = <T extends RowData>({ t, column, filterValue: columnFilterValue }: Props<T>) => {
  return (
    <DebouncedInput
      type="number"
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={t("table.search")}
      className="w-36 border shadow rounded bg-white"
    />
  );
};
export default NumberFilter;
