import type { RowData } from "@tanstack/react-table";
import DebouncedInput from "@/components/table/filter/DebouncedInput";
import TextFunction from "@/types/TextFunction";
import { Column } from "@/components/table/tableTypes";

interface Props<T extends RowData> {
  t: TextFunction;
  column: Column<T>;
  filterValue?: unknown;
  minValue?: number;
  maxValue?: number;
}

const RangeFilter = <T extends RowData>({
  t,
  column,
  minValue,
  maxValue,
  filterValue: columnFilterValue,
}: Props<T>) => {
  return (
    <div>
      <div className="flex space-x-2 flex-col">
        <div className="flex items-start">
          <DebouncedInput
            id="min"
            type="number"
            value={(columnFilterValue as [number, number])?.[0] ?? 0}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => {
                let newMin = value as number;
                const newMax = old?.[1];
                if (newMax < newMin) {
                  newMin = newMax;
                }
                return [newMin, newMax];
              })
            }
            placeholder={t("common.min")}
            className="w-36 border shadow rounded bg-white"
            min={minValue}
            max={maxValue}
            step={1}
          />
        </div>
        <div className="flex items-start">
          <DebouncedInput
            id="max"
            type="number"
            value={(columnFilterValue as [number, number])?.[1] ?? undefined}
            onChange={(value) =>
              column.setFilterValue((old: [number, number]) => {
                const newMin = old?.[0];
                const newMax = value as number;
                return [newMin, newMax];
              })
            }
            placeholder={t("common.max")}
            className="w-36 border shadow rounded bg-white"
            min={minValue}
            max={maxValue}
            step={1}
          />
        </div>
      </div>
    </div>
  );
};
export default RangeFilter;
