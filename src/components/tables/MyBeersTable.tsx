import ActionKnapper from "@/components/ActionKnapper";
import Table from "@/components/table/Table";
import FilterVariant from "@/components/table/filter/FilterVariant";
import Meta from "@/components/table/filter/Meta";
import ButtonProps, { ButtonType } from "@/types/ButtonProps";
import { Beer, ReviewWithoutChildren } from "@/types/generated";
import { FilterFn, createColumnHelper } from "@tanstack/react-table";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { GiCheckMark } from "react-icons/gi";
import { MdOutlineBlock } from "react-icons/md";
import { useNavigate } from "react-router";

const MyBeersTable: FC<{
    beers: Beer[];
    page: string;
    buttons?: ButtonProps[];
}> = ({ beers, page, buttons = [] }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const archivedFilter: FilterFn<Beer> = (row, columnId, filterValue) => {
        const rowValue = row.getValue(columnId);
        return filterValue === null || filterValue === undefined ? true : String(rowValue) !== filterValue;
    };

    const columnHelper = createColumnHelper<Beer>();
    const metaArchived: Meta = { filterVariant: FilterVariant.activeInverted };
    const columns = [
        columnHelper.accessor("name", {
            header: t("mybeerstable.name"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("style", {
            header: t("mybeerstable.style"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("desiredDate", {
            header: t("mybeerstable.desiredday"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("archived", {
            header: t("mybeerstable.active"),
            cell: (info) =>
                info.getValue() ? (
                    <MdOutlineBlock title={t("mybeerstable.archived")} />
                ) : (
                    <GiCheckMark title={t("mybeerstable.active")} />
                ),
            enableColumnFilter: true,
            enableSorting: true,
            filterFn: archivedFilter,
            meta: metaArchived,
        }),
        columnHelper.accessor("id", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <ActionKnapper
                        key={`renderRowActions-${row.id}`}
                        id={`renderRowActions-${row.id}`}
                        buttons={[
                            {
                                icon: ButtonType.VIEW,
                                text: t("mybeerstable.details"),
                                onClick: () => navigate(`/beers/details/${row.id}?from=${page}`),
                            },
                            {
                                icon: ButtonType.REVIEWS,
                                text: t("mybeerstable.reviews"),
                                color: "secondary",
                                hidden: isHidden(row.reviews),
                                onClick: () => navigate(`/beers/reviews/${row.id}?from=${page}`),
                            },
                        ]}
                    />
                );
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
    ];

    const isHidden = (reviews?: ReviewWithoutChildren[]) => {
        if (!reviews) return true;
        return reviews.length === 0;
    };

    return (
        <Table
            data={beers}
            cols={columns}
            actionButtons={buttons && buttons.length > 0 ? <ActionKnapper buttons={buttons} /> : undefined}
        />
    );
};
export default MyBeersTable;
