import DebouncedInput from "@/components/table/filter/DebouncedInput";
import { Column } from "@tanstack/react-table";
import { FC } from "react";

interface Props {
    t: (key: string) => string;
    column: Column<any>;
}
const NumberFilter: FC<Props> = ({ t, column }) => {
    const columnFilterValue = column.getFilterValue();
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
