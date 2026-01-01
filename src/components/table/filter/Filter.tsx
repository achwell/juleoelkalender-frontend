import ActiveInvertedFilter from "@/components/table/filter/ActiveInvertedFilter";
import DebouncedInput from "@/components/table/filter/DebouncedInput";
import FilterVariant from "@/components/table/filter/FilterVariant";
import Meta from "@/components/table/filter/Meta";
import NumberFilter from "@/components/table/filter/NumberFilter";
import PublishedInvertedFilter from "@/components/table/filter/PublishedInvertedFilter";
import RangeFilter from "@/components/table/filter/RangeFilter";
import RoleFilter from "@/components/table/filter/RoleFilter";
import { Column } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

const Filter = ({ column }: { column: Column<any> }) => {
    const { t } = useTranslation();
    const columnFilterValue = column.getFilterValue();

    // @ts-ignore
    const meta: Meta | undefined = column.columnDef.meta;

    switch (meta?.filterVariant) {
        case FilterVariant.publishedInverted:
            return <PublishedInvertedFilter t={t} column={column} />;
        case FilterVariant.activeInverted:
            return <ActiveInvertedFilter t={t} column={column} />;
        case FilterVariant.role:
            return <RoleFilter t={t} column={column} />;
        case FilterVariant.number:
            return <NumberFilter t={t} column={column} />;
        case FilterVariant.range:
            return <RangeFilter t={t} column={column} minValue={meta?.minValue} maxValue={meta?.maxValue} />;
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
};
export default Filter;
