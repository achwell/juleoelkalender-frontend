import FilterVariant from "@/components/table/filter/FilterVariant";
import { ColumnMeta } from "@tanstack/react-table";

type Meta =
    | ({
          filterVariant: Exclude<FilterVariant, FilterVariant.range>;
      } & ColumnMeta<any, any>)
    | ({
          filterVariant: FilterVariant.range;
          minValue?: number;
          maxValue?: number;
      } & ColumnMeta<any, any>);

export default Meta;
