import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import Paragraph from "@/components/layout/Paragraph";
import ReviewTable from "@/components/reviews/ReviewTable";
import { useGetReviewDataByBeerIdQuery } from "@/redux/api/reviewApi";
import { ButtonType } from "@/types/ButtonProps";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";

const BeerReviewsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const { id } = useParams();

    const { data: reviews } = useGetReviewDataByBeerIdQuery(id ?? "", {
        skip: !id,
    });

    if (!reviews) return <FullScreenLoader />;

    return (
        <>
            <H1>{t("pages.beerreview.header")}</H1>
            <Paragraph>
                {t("pages.beerreview.ingress")}{" "}
                <Link
                    to="https://norbrygg.no/bedomming-av-ol/dommerskjema/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    {t("pages.beerreview.ingresslinktext")}
                </Link>
                {t("pages.beerreview.ingress2")}
            </Paragraph>
            {from && (
                <ActionKnapper
                    buttons={[
                        {
                            icon: ButtonType.BACK,
                            text: t("buttons.back"),
                            onClick: () => navigate(from),
                        },
                    ]}
                />
            )}
            {reviews.map((item) => (
                <ReviewTable
                    key={`${item.calendar.id}${Math.random().toString(36)}`}
                    calendar={item.calendar}
                    reviews={item.reviews}
                    average={item.average}
                />
            ))}
        </>
    );
};
export default BeerReviewsPage;
