import DebouncedInput from "@/components/table/filter/DebouncedInput";
import { Column } from "@tanstack/react-table";
import { FC } from "react";

interface Props {
    t: (key: string) => string;
    column: Column<any>;
    minValue?: number;
    maxValue?: number | undefined;
}

const RangeFilter: FC<Props> = ({ t, column, minValue, maxValue }) => {
    const columnFilterValue = column.getFilterValue();
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
                                if (newMax < newMin) newMin = newMax;
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
