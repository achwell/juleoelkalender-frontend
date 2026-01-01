import ActionKnapper from "@/components/ActionKnapper";
import Table from "@/components/table/Table";
import { useDownloadAllReviewsExcelMutation } from "@/redux/api/reviewApi";
import { ButtonType } from "@/types/ButtonProps";
import { ReviewWithUser } from "@/types/generated";
import { formateRatingvalue } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    reviews: ReviewWithUser[];
}

const TotalReviews: FC<Props> = ({ reviews }) => {
    const [downloadReport] = useDownloadAllReviewsExcelMutation();
    const { i18n, t } = useTranslation();

    const columnHelper = createColumnHelper<ReviewWithUser>();
    const columns = [
        columnHelper.accessor("calendar.year", {
            header: t("pages.totalreviews.calendar.year"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("calendar.name", {
            header: t("pages.totalreviews.calendar.calendar"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.name", {
            header: t("pages.totalreviews.calendar.beer"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.style", {
            header: t("beer.style"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.brewer", {
            header: t("beer.brewer"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("ratingFeel", {
            header: t("rating.feel"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("ratingSmell", {
            header: t("rating.smell"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("ratingTaste", {
            header: t("rating.taste"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("ratingLabel", {
            header: t("rating.label"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("ratingLooks", {
            header: t("rating.looks"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("ratingOverall", {
            header: t("rating.overall"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("total", {
            header: t("rating.total"),
            cell: (info) => formateRatingvalue(info.getValue()),
            filterFn: "fuzzy",
        }),
    ];
    if (!reviews) return null;
    return (
        <Table
            data={reviews}
            cols={columns}
            actionButtons={
                reviews.length > 0 ? (
                    <ActionKnapper
                        buttons={[
                            {
                                icon: ButtonType.EXCEL,
                                color: "primary",
                                variant: "text",
                                onClick: () => {
                                    const name = t("pages.beerreview.excelexportfilename");
                                    const language = i18n.language;
                                    downloadReport({
                                        name,
                                        language,
                                    });
                                },
                            },
                        ]}
                    />
                ) : undefined
            }
        />
    );
};
export default TotalReviews;
