import { Column } from "@tanstack/react-table";
import { FC } from "react";

interface Props {
    t: (key: string) => string;
    column: Column<any>;
}
const ActiveInvertedFilter: FC<Props> = ({ t, column }) => {
    const columnFilterValue = column.getFilterValue();
    return (
        <select
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
            className="w-36 border shadow rounded bg-white"
        >
            <option value="">{t("table.filter.all")}</option>
            <option value="false">{t("mybeerstable.archived")}</option>
            <option value="true">{t("mybeerstable.active")}</option>
        </select>
    );
};
export default ActiveInvertedFilter;
