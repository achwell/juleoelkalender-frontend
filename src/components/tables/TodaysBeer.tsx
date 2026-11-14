import FullScreenLoader from "@/components/FullScreenLoader";
import H2 from "@/components/layout/H2";
import ViewBeerModal from "@/components/modals/ViewBeerModal";
import Table from "@/components/table/Table";
import TodaysBeerActionKnapper from "@/components/tables/TodaysBeerActionKnapper";
import { useGetTodaysBeersQuery } from "@/redux/api/beerApi";
import { useAppSelector } from "@/redux/hooks";
import BeerDetails from "@/types/BeerDetails";
import BeerWithCalendarAndDayAndReview from "@/types/BeerWithCalendarAndDayAndReview";
import { formateRatingvalue } from "@/utils";
import { createColumnHelper } from "@/components/table/tableTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const TodaysBeer = () => {
  const { currentUser } = useAppSelector((state) => state.authState);
  const { data, isFetching } = useGetTodaysBeersQuery();
  const [open, setOpen] = useState(false);
  const [beer, setBeer] = useState<BeerDetails>();
  const { t } = useTranslation();

  const getReview = (row: BeerWithCalendarAndDayAndReview, rating: number) => {
    const reviewer = row?.review?.user ? row.review.user.id : undefined;
    const currentUserId = currentUser?.id;
    return currentUserId === reviewer ? formateRatingvalue(rating) : "";
  };

  const columnHelper = createColumnHelper<BeerWithCalendarAndDayAndReview>();
  const columns = [
    columnHelper.accessor("calendar.name", {
      header: t("todaysbeer.calendar"),
      cell: (info) => info.getValue(),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("beer.name", {
      header: t("todaysbeer.beer"),
      cell: (info) => info.getValue(),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingTaste", {
      header: t("rating.taste"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingTaste", {
      header: t("rating.taste"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingSmell", {
      header: t("rating.smell"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingFeel", {
      header: t("rating.feel"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingLooks", {
      header: t("rating.looks"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingLabel", {
      header: t("rating.label"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("review.ratingOverall", {
      header: t("rating.overall"),
      cell: (info) => getReview(info.row.original, info.getValue()),
      enableSorting: false,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("beer.id", {
      header: "",
      cell: (info) => <TodaysBeerActionKnapper row={info.row.original} setBeer={setBeer} setOpen={setOpen} />,
      enableColumnFilter: false,
      enableSorting: false,
    }),
  ];

  if (isFetching) {
    return <FullScreenLoader />;
  }

  if (!data || data.length < 1) {
    return null;
  }

  return (
    <>
      <ViewBeerModal beerDetails={beer} show={open} hide={() => setOpen(false)} />
      <H2>{t("todaysbeer.todaysbeer")}</H2>
      <Table data={data} columns={columns} small={true} disableGlobalFilters={true} />
    </>
  );
};
export default TodaysBeer;
