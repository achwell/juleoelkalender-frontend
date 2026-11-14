import { rankItem, type RankingInfo } from "@tanstack/match-sorter-utils";
import {
  columnFilteringFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_includesString,
  filterFn_inNumberRange,
  filterFn_inDateRange,
  filterFn_weakEquals,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  metaHelper,
  tableFeatures,
} from "@tanstack/react-table";
import type Meta from "@/components/table/filter/Meta";

interface FuzzyFilterMeta {
  itemRank: RankingInfo;
}
const fuzzyFilter = (
  row: { getValue: (columnId: string) => unknown },
  columnId: string,
  value: string,
  addMeta?: (meta: FuzzyFilterMeta) => void,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta?.({ itemRank });
  return itemRank.passed;
};

export const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  columnSizingFeature,
  columnResizingFeature,
  rowSortingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    fuzzy: fuzzyFilter,
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    equals: filterFn_equals,
    arrIncludes: filterFn_arrIncludes,
    inDateRange: filterFn_inDateRange,
    weakEquals: filterFn_weakEquals,
  },
  sortFns: { alphanumeric: sortFn_alphanumeric, basic: sortFn_basic, datetime: sortFn_datetime, text: sortFn_text },
  filterMeta: metaHelper<FuzzyFilterMeta>(),
  columnMeta: metaHelper<Meta>(),
});
export type AppFeatures = typeof features;
