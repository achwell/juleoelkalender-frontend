import { createColumnHelper as createV9ColumnHelper, type RowData } from "@tanstack/react-table";
import type * as TableCore from "@tanstack/react-table";
import type { AppFeatures } from "@/components/table/tableFeatures";

export const createColumnHelper = <TData extends RowData>() => createV9ColumnHelper<AppFeatures, TData>();
export type Column<TData extends RowData, TValue = unknown> = TableCore.Column<AppFeatures, TData, TValue>;
export type ColumnDef<TData extends RowData, TValue = unknown> = TableCore.ColumnDef<AppFeatures, TData, TValue>;
export type FilterFn<TData extends RowData> = TableCore.FilterFn<AppFeatures, TData>;
export type Header<TData extends RowData, TValue = unknown> = TableCore.Header<AppFeatures, TData, TValue>;
export type HeaderGroup<TData extends RowData> = TableCore.HeaderGroup<AppFeatures, TData>;
export type Row<TData extends RowData> = TableCore.Row<AppFeatures, TData>;
export type Table<TData extends RowData> = TableCore.Table<AppFeatures, TData>;
