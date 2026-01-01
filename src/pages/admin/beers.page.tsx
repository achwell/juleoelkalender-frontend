import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import Table from "@/components/table/Table";
import { useDownloadAllBeersExcelMutation, useGetAllBeersWithCalendarQuery } from "@/redux/api/beerApi";
import { ButtonType } from "@/types/ButtonProps";
import { BeerWithCalendarAndDay } from "@/types/generated";
import { createColumnHelper } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { GiCheckMark } from "react-icons/gi";
import { MdOutlineBlock } from "react-icons/md";
import { useNavigate } from "react-router";

const AllBeersPage = () => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();

    const { data: beers } = useGetAllBeersWithCalendarQuery();

    const [downloadReport] = useDownloadAllBeersExcelMutation();

    const columnHelper = createColumnHelper<BeerWithCalendarAndDay>();
    const columns = [
        columnHelper.accessor("beer.name", {
            header: t("beer.name"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.brewer", {
            header: t("beer.brewer"),
            cell: (info) => {
                const { firstName, middleName, lastName } = info.getValue();
                return [firstName, middleName, lastName].filter((s) => !!s).join(" ");
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.style", {
            header: t("beer.style"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.abv", {
            header: t("beer.abv"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.archived", {
            header: t("mybeerstable.active"),
            cell: (info) =>
                info.getValue() ? (
                    <MdOutlineBlock title={t("mybeerstable.archived")} />
                ) : (
                    <GiCheckMark title={t("mybeerstable.active")} />
                ),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("calendar.year", {
            header: t("pages.beeradmin.year"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("calendar.name", {
            header: t("pages.beeradmin.calendar"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("day", {
            header: t("pages.beeradmin.dayincalendar"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
    ];

    if (!beers) return <FullScreenLoader />;

    return (
        <>
            <H1>{t("pages.beeradmin.header")}</H1>
            <Table
                data={beers}
                cols={columns}
                actionButtons={
                    <ActionKnapper
                        buttons={[
                            {
                                icon: ButtonType.BACK,
                                text: t("buttons.back"),
                                onClick: () => navigate("/calendar/"),
                            },
                            {
                                icon: ButtonType.EXCEL,
                                color: "primary",
                                variant: "text",
                                onClick: () => {
                                    const name = t("pages.beeradmin.excelexportfilename");
                                    const language = i18n.language;
                                    downloadReport({ name, language });
                                },
                            },
                        ]}
                    />
                }
            />
        </>
    );
};
export default AllBeersPage;
