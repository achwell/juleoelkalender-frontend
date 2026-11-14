import FilterVariant from "@/components/table/filter/FilterVariant";

type Meta =
  | {
      filterVariant: Exclude<FilterVariant, FilterVariant.range>;
    }
  | {
      filterVariant: FilterVariant.range;
      minValue?: number;
      maxValue?: number;
    };

export default Meta;
