import type { RowData } from "@tanstack/react-table";
import TextFunction from "@/types/TextFunction";
import { Column } from "@/components/table/tableTypes";

interface Props<T extends RowData> {
  t: TextFunction;
  column: Column<T>;
  filterValue?: unknown;
}

const PublishedInvertedFilter = <T extends RowData>({ t, column, filterValue: columnFilterValue }: Props<T>) => {
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
