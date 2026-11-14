import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import Paragraph from "@/components/layout/Paragraph";
import TotalReviews from "@/components/tables/TotalReviews";
import { useGetReviewsQuery } from "@/redux/api/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { hasAuthority } from "@/utils";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const TotalReviewsPage = () => {
  const { data, isFetching } = useGetReviewsQuery();
  const { currentUser } = useAppSelector((state) => state.authState);
  const { t } = useTranslation();
  const reviews =
    currentUser && data
      ? hasAuthority(currentUser, "review:total")
        ? data
        : data.filter((r) => r.beer.brewer.id === currentUser.id)
      : [];

  if (isFetching || !data) {
    return <FullScreenLoader />;
  }

  return (
    <div className="w-full p-4">
      <H1>{t("pages.totalreviews.header")}</H1>
      <Paragraph>
        {t("pages.totalreviews.ingress")}{" "}
        <Link
          to="https://norbrygg.no/bedomming-av-ol/dommerskjema/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800"
        >
          {t("pages.totalreviews.ingresslinktext")}
        </Link>
        {t("pages.totalreviews.ingress2")}
      </Paragraph>
      <TotalReviews reviews={reviews} />
    </div>
  );
};
export default TotalReviewsPage;
