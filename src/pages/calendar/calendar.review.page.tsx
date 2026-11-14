import ReviewForm from "@/components/calendar/ReviewForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import H2 from "@/components/layout/H2";
import {
  useGetBeerQuery,
  useGetBeersWithReviewByCalendarAndUserQuery,
  useGetTodaysBeersQuery,
} from "@/redux/api/beerApi";
import { useGetCalendarQuery } from "@/redux/api/calendarApi";
import { useGetReviewByCalendarBeerAndReviewerQuery } from "@/redux/api/reviewApi";
import { useAppSelector } from "@/redux/hooks";
import { handleErrorWithStatus } from "@/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router";

const CalendarReviewPage = () => {
  const { t } = useTranslation();
  const { calendarId, beerId } = useParams();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.authState);

  const {
    data: beer,
    refetch: refetchBeer,
    isError: isErrorBeer,
    error: errorBeer,
  } = useGetBeerQuery(beerId ?? "", { skip: !beerId });
  const {
    data: calendar,
    refetch: refetchCalendar,
    isError: isErrorCalendar,
    error: errorCalendar,
  } = useGetCalendarQuery(calendarId ?? "", { skip: !calendarId });
  const { refetch: refetchReviews } = useGetBeersWithReviewByCalendarAndUserQuery(
    { calendarId: calendarId ?? "", userId: currentUser?.id ?? "" },
    { skip: !calendarId || !currentUser },
  );
  const {
    data: review,
    refetch: refetchReview,
    isError: isErrorReview,
    error: errorReview,
  } = useGetReviewByCalendarBeerAndReviewerQuery(
    {
      calendarId: calendarId ?? "",
      beerId: beerId ?? "",
      reviewerId: currentUser ? currentUser.id! : "",
    },
    { skip: !calendarId || !beerId || !currentUser },
  );
  const { refetch: refetchTodaysBeers } = useGetTodaysBeersQuery();

  useEffect(() => {
    let redirect = false;
    if (isErrorBeer && errorBeer) {
      redirect = "status" in errorBeer && (errorBeer.status === 401 || errorBeer.status === 403);
      handleErrorWithStatus(t, errorBeer);
    }
    if (isErrorCalendar && errorCalendar) {
      redirect = "status" in errorCalendar && (errorCalendar.status === 401 || errorCalendar.status === 403);
      handleErrorWithStatus(t, errorCalendar);
    }
    if (isErrorReview && errorReview) {
      redirect = "status" in errorReview && (errorReview.status === 401 || errorReview.status === 403);
      handleErrorWithStatus(t, errorReview);
    }
    if (redirect) {
      navigate("/login");
    }
  }, [isErrorBeer, isErrorCalendar, isErrorReview, errorBeer, errorCalendar, errorReview, t, navigate]);

  const refresh = async () => {
    refetchBeer();
    refetchCalendar();
    refetchReview();
    refetchReviews();
    refetchTodaysBeers();
  };

  if (!calendar || !review || !beer) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <H1>{review.id ? t("pages.calendar.review.editvote") : t("pages.calendar.review.addvote")}</H1>
      <H2>{beer.name}</H2>
      <ReviewForm review={review} callback={refresh} from={from} />
    </>
  );
};
export default CalendarReviewPage;
