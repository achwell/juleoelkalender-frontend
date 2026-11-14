import { Subscribe, type RowData } from "@tanstack/react-table";
import ActiveInvertedFilter from "@/components/table/filter/ActiveInvertedFilter";
import DebouncedInput from "@/components/table/filter/DebouncedInput";
import FilterVariant from "@/components/table/filter/FilterVariant";
import NumberFilter from "@/components/table/filter/NumberFilter";
import PublishedInvertedFilter from "@/components/table/filter/PublishedInvertedFilter";
import RangeFilter from "@/components/table/filter/RangeFilter";
import RoleFilter from "@/components/table/filter/RoleFilter";
import { Column } from "@/components/table/tableTypes";
import { useTranslation } from "react-i18next";

const Filter = <T extends RowData>({ column }: { column: Column<T> }) => {
  const { t } = useTranslation();
  return (
    <Subscribe source={column.table.atoms.columnFilters}>
      {(filters) => {
        const columnFilterValue = filters.find((filter) => filter.id === column.id)?.value;

        const meta = column.columnDef.meta;

        switch (meta?.filterVariant) {
          case FilterVariant.publishedInverted:
            return <PublishedInvertedFilter t={t} column={column} filterValue={columnFilterValue} />;
          case FilterVariant.activeInverted:
            return <ActiveInvertedFilter t={t} column={column} filterValue={columnFilterValue} />;
          case FilterVariant.role:
            return <RoleFilter t={t} column={column} filterValue={columnFilterValue} />;
          case FilterVariant.number:
            return <NumberFilter t={t} column={column} filterValue={columnFilterValue} />;
          case FilterVariant.range:
            return (
              <RangeFilter
                t={t}
                column={column}
                filterValue={columnFilterValue}
                minValue={meta?.minValue}
                maxValue={meta?.maxValue}
              />
            );
          default:
            return (
              <DebouncedInput
                type="text"
                value={(columnFilterValue ?? "") as string}
                onChange={(value) => column.setFilterValue(value)}
                placeholder={t("table.search")}
                className="w-36 border shadow rounded bg-white"
              />
            );
        }
      }}
    </Subscribe>
  );
};
export default Filter;
