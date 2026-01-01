import { Column } from "@tanstack/react-table";
import { FC } from "react";

interface Props {
    t: (key: string) => string;
    column: Column<any>;
}
const PublishedInvertedFilter: FC<Props> = ({ t, column }) => {
    const columnFilterValue = column.getFilterValue();
    return (
        <select
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
            className="w-36 border shadow rounded bg-white"
        >
            <option value="">{t("table.filter.all")}</option>
            <option value="false">{t("pages.calendar.admin.published")}</option>
            <option value="true">{t("pages.calendar.admin.hidden")}</option>
        </select>
    );
};
export default PublishedInvertedFilter;
