import H2 from "@/components/layout/H2";
import CommentsTable from "@/components/reviews/CommentsTable";
import RatingTable from "@/components/reviews/RatingTable";
import { Calendar, Review } from "@/types/generated";
import { calculateAverage } from "@/utils";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    calendar: Calendar;
    reviews: Review[];
    average: Review;
}

const ReviewTable: FC<Props> = ({ calendar, reviews, average }) => {
    const { t } = useTranslation();
    const averageMyBeer = calculateAverage(reviews);
    const comments = reviews.map((r) => r.comment).filter((c) => !!c);

    return (
        <>
            <H2>{`${calendar.name} - ${calendar.year}`}</H2>
            <RatingTable average={average} averageMyBeer={averageMyBeer} />
            {comments && comments.length > 0 && <H2>{t("reviewtable.comments")}</H2>}
            {comments && comments.length > 0 && <CommentsTable comments={comments} />}
        </>
    );
};
export default ReviewTable;
