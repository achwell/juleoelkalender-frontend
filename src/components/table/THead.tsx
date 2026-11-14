import TableHeader from "@/components/table/TableHeader";
import { RowData } from "@tanstack/react-table";
import { HeaderGroup } from "@/components/table/tableTypes";

interface Props<T extends RowData> {
  headerGroups: HeaderGroup<T>[];
  small: boolean;
}

const THead = <T extends RowData>({ headerGroups, small }: Props<T>) => {
  return (
    <thead className="bg-gray-100">
      {headerGroups.map((headerGroup) => (
        <tr key={`headerGroup-${headerGroup.id}`}>
          {headerGroup.headers.map((header) => (
            <TableHeader key={`header-${header.id}`} header={header} small={small} />
          ))}
        </tr>
      ))}
    </thead>
  );
};
export default THead;
