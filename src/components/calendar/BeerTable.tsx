import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import ViewBeerModal from "@/components/modals/ViewBeerModal";
import Table from "@/components/table/Table";
import { useAppSelector } from "@/redux/hooks";
import BeerDetails from "@/types/BeerDetails";
import { ButtonType } from "@/types/ButtonProps";
import { UserWithoutChildren } from "@/types/generated";
import { createColumnHelper } from "@tanstack/react-table";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const BeerTable: FC<{ beers: BeerDetails[]; back: () => void }> = ({ beers, back }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.authState);
    const [open, setOpen] = useState(false);
    const [beer, setBeer] = useState<BeerDetails>();

    const formatReview = (reviewer: UserWithoutChildren | undefined, rating: number | undefined) => {
        const currentUserId = currentUser?.id;
        return currentUserId === reviewer?.id && rating ? rating.toString() : "";
    };

    const columnHelper = createColumnHelper<BeerDetails>();
    const columns = [
        columnHelper.accessor("beer.name", {
            header: t("pages.calendarview.beer.name"),
            cell: (info) => info.getValue(),
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("review.ratingTaste", {
            header: t("rating.taste"),
            cell: (info) => {
                if (!info.getValue()) return "";
                const row = info.row.original;
                const { review }: BeerDetails = row;
                const rating = review ? review.ratingTaste : undefined;
                return formatReview(review?.user, rating);
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("review.ratingSmell", {
            header: t("rating.smell"),
            cell: (info) => {
                if (!info.getValue()) return "";
                const row = info.row.original;
                const { review }: BeerDetails = row;
                const rating = review ? review.ratingSmell : undefined;
                return formatReview(review?.user, rating);
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("review.ratingFeel", {
            header: t("rating.feel"),
            cell: (info) => {
                if (!info.getValue()) return "";
                const row = info.row.original;
                const { review }: BeerDetails = row;
                const rating = review ? review.ratingFeel : undefined;
                return formatReview(review?.user, rating);
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("review.ratingLooks", {
            header: t("rating.looks"),
            cell: (info) => {
                if (!info.getValue()) return "";
                const row = info.row.original;
                const { review }: BeerDetails = row;
                const rating = review ? review.ratingLooks : undefined;
                return formatReview(review?.user, rating);
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("review.ratingLabel", {
            header: t("rating.label"),
            cell: (info) => {
                if (!info.getValue()) return "";
                const row = info.row.original;
                const { review }: BeerDetails = row;
                const rating = review ? review.ratingLabel : undefined;
                return formatReview(review?.user, rating);
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("review.ratingOverall", {
            header: t("rating.overall"),
            cell: (info) => {
                if (!info.getValue()) return "";
                const row = info.row.original;
                const { review }: BeerDetails = row;
                const rating = review ? review.ratingOverall : undefined;
                return formatReview(review?.user, rating);
            },
            filterFn: "fuzzy",
        }),
        columnHelper.accessor("beer.id", {
            header: "",
            cell: (info) => {
                const row = info.row.original;
                return (
                    <ActionKnapper
                        key={`renderRowActions-${row.beer.id}`}
                        id={`renderRowActions-${row.beer.id}`}
                        buttons={[
                            {
                                icon: ButtonType.VIEW,
                                text: t("pages.calendarview.beer.details"),
                                onClick: () => {
                                    setBeer(row);
                                    setOpen(true);
                                },
                            },
                            {
                                icon: row.review ? ButtonType.EDIT : ButtonType.NEW,
                                text: row.review
                                    ? t("pages.calendar.review.editvote")
                                    : t("pages.calendar.review.addvote"),
                                onClick: () => navigate(`/calendar/${row.calendarId}/${row.beer.id}`),
                                hidden: row.beer.brewer.id === currentUser?.id,
                            },
                        ]}
                    />
                );
            },
            enableColumnFilter: false,
            enableSorting: false,
        }),
    ];

    if (!beers || !columns) return <FullScreenLoader />;

    return (
        <>
            <ViewBeerModal beerDetails={beer} show={open} hide={() => setOpen(false)} />
            <Table
                data={beers}
                cols={columns}
                actionButtons={
                    <ActionKnapper
                        buttons={[
                            {
                                text: t("buttons.back"),
                                icon: ButtonType.BACK,
                                onClick: back,
                            },
                        ]}
                    />
                }
            />
        </>
    );
};
export default BeerTable;
