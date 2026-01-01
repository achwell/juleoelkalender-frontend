import TableHeader from "@/components/table/TableHeader";
import { HeaderGroup, RowData } from "@tanstack/react-table";
import { FC } from "react";

interface Props {
    headerGroups: HeaderGroup<RowData>[];
    small: boolean;
}

const THead: FC<Props> = ({ headerGroups, small }) => {
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
