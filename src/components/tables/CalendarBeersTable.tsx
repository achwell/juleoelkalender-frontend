import ActionKnapper from "@/components/ActionKnapper";
import RemoveBeerModal from "@/components/modals/RemoveBeerModal";
import Table from "@/components/table/Table";
import CalendarBeersTableActionKnapper from "@/components/tables/CalendarBeersTableActionKnapper";
import { MoveCalendar, useDeleteBeerCalendarMutation } from "@/redux/api/beerCalendarApi";
import { useAppSelector } from "@/redux/hooks";
import ButtonProps from "@/types/ButtonProps";
import { Beer, BeerCalendar, Calendar, CalendarWithBeer } from "@/types/generated";
import { handleErrorWithStatus } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const CalendarBeersTable: FC<{
  data: CalendarWithBeer[];
  allBeers: Beer[];
  allBeerCalendars: BeerCalendar[];
  buttons: ButtonProps[];
  calendar: Calendar;
  refreshData: () => Promise<void>;
  moveBeerCalendars: (data: MoveCalendar) => Promise<void>;
}> = ({ data, allBeers, allBeerCalendars, buttons, calendar, refreshData, moveBeerCalendars }) => {
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state) => state.authState);
  const [
    deleteBeerCalendar,
    { isLoading: isDeletingBeerCalendar, isSuccess: isSuccessDeleting, isError: isErrorDeleting, error: errorDeleting },
  ] = useDeleteBeerCalendarMutation();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [beer, setBeer] = useState<Beer>();

  useEffect(() => {
    if (isDeletingBeerCalendar) {
      if (isSuccessDeleting) {
        setShowDeleteDialog(false);
        refreshData().then(() => {
          toast.success(
            t("pages.calendar.admin.beerremoved", {
              beer: beer?.name,
              year: calendar?.year,
              calendar: calendar?.name,
            }),
          );
        });
      } else if (isErrorDeleting && errorDeleting) {
        handleErrorWithStatus(t, errorDeleting);
      }
    }
  }, [isDeletingBeerCalendar]);

  const deleteBeer = async () => {
    if (calendar && beer && allBeerCalendars) {
      const beerCaledar = allBeerCalendars.find(
        (bc) => !!bc.calendar && bc.calendar.id === calendar.id && bc.beer.id === beer.id,
      );
      if (beerCaledar?.id) {
        deleteBeerCalendar(beerCaledar.id);
      }
      setShowDeleteDialog(false);
    }
  };

  const columnHelper = createColumnHelper<CalendarWithBeer>();
  const columns = [
    columnHelper.accessor("day", {
      header: t("pages.calendarview.beer.day"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.name", {
      header: t("beer.name"),
      cell: (info) => {
        const {
          beer: { id, name },
        } = info.row.original;
        return id === "N/A" ? "" : name;
      },
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.style", {
      header: t("beer.style"),
      cell: (info) => {
        const {
          beer: { id, style },
        } = info.row.original;
        return id === "N/A" ? "" : style;
      },
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.abv", {
      header: t("beer.abv"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.ebc", {
      header: t("beer.ebc"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.ibu", {
      header: t("beer.ibu"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.brewer", {
      header: t("beer.brewer"),
      cell: (info) => {
        const {
          beer: { id, brewer },
        } = info.row.original;
        let name = "";
        if (id !== "N/A" && brewer) {
          name = [brewer.firstName, brewer.middleName, brewer.lastName].filter((s) => !!s).join(" ");
        }
        return name;
      },
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("beer.id", {
      header: "",
      cell: (info) => {
        const row = info.row.original;
        const {
          id,
          beer: { id: beerId },
          day,
        } = row;
        if (beerId === "N/A") {
          return [];
        }
        return (
          <CalendarBeersTableActionKnapper
            id={id}
            beerId={beerId}
            calendar={calendar}
            day={day}
            allBeers={allBeers}
            moveBeerCalendars={moveBeerCalendars}
            setBeer={setBeer}
            setShowDeleteDialog={setShowDeleteDialog}
            refreshData={refreshData}
          />
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
    }),
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <RemoveBeerModal
        beerName={beer?.name}
        calendarName={calendar?.name}
        calendarYear={calendar?.year}
        isDeletingBeerCalendar={isDeletingBeerCalendar}
        show={showDeleteDialog}
        hide={() => setShowDeleteDialog(false)}
        callback={deleteBeer}
      />
      <Table
        data={data}
        cols={columns}
        defaultPagination={{ pageSize: 24, pageIndex: 0 }}
        actionButtons={<ActionKnapper buttons={buttons} />}
      />
    </>
  );
};
export default CalendarBeersTable;
