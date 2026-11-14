import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import AddEditCalendarTokenModal from "@/components/modals/AddEditCalendarTokenModal";
import RemoveCalendarTokenModal from "@/components/modals/RemoveCalendarTokenModal";
import Table from "@/components/table/Table";
import { useGetCalendarsQuery } from "@/redux/api/calendarApi";
import {
  useAddCalendarTokenMutation,
  useDeleteCalendarTokenMutation,
  useGetCalendarTokensQuery,
  useUpdateCalendarTokenMutation,
} from "@/redux/api/calendarTokenApi";
import { useGetUsersQuery } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { CalendarToken } from "@/types/generated";
import { handleErrorWithStatus, hasAuthority } from "@/utils";
import { createColumnHelper } from "@/components/table/tableTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GiCheckMark } from "react-icons/gi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const initialState = { id: uuidv4(), token: "", name: "", active: true };

const TokensPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAppSelector((state) => state.authState);
  const { data: calendarTokens, isFetching: isFetchingTokens, refetch } = useGetCalendarTokensQuery();

  const { data: users, isFetching: isFetchingUsers } = useGetUsersQuery();
  const { data: calendars, isFetching: isFetchingCalendars } = useGetCalendarsQuery();

  const [addCalendarTokenRequest, { isLoading: isAdding }] = useAddCalendarTokenMutation();
  const addCalendarToken = async (...args: Parameters<typeof addCalendarTokenRequest>) => {
    const result = await addCalendarTokenRequest(...args);

    if ("data" in result && result.data) {
      if (result.data) {
        toast.success(t("add.added", { field: result.data?.token }));
        setSelectedToken(result.data);
      }
      setShowAddEditDialog(false);
      await refetch();
    }
    if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
      toast.error(t("add.error", { field: selectedToken.token }));
      setSelectedToken(initialState);
      setShowDeleteDialog(false);
    }

    return result;
  };

  const [deleteCalendarTokenRequest, { isLoading: isDeleting }] = useDeleteCalendarTokenMutation();
  const deleteCalendarToken = async (...args: Parameters<typeof deleteCalendarTokenRequest>) => {
    const result = await deleteCalendarTokenRequest(...args);

    if ("data" in result) {
      toast.success(t("delete.deleted", { name: selectedToken.token }));
      await refetch();
      setSelectedToken(initialState);
      setShowDeleteDialog(false);
    }
    if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
      toast.error(t("delete.error", { name: selectedToken.token }));
      setSelectedToken(initialState);
      setShowDeleteDialog(false);
    }

    return result;
  };

  const [updateCalendarTokenRequest, { isLoading: isUpdating }] = useUpdateCalendarTokenMutation();
  const updateCalendarToken = async (...args: Parameters<typeof updateCalendarTokenRequest>) => {
    const result = await updateCalendarTokenRequest(...args);

    if ("data" in result && result.data) {
      if (result.data) {
        toast.success(t("update.updated", { field: result.data?.token }));
        setSelectedToken(result.data);
      }
      setShowAddEditDialog(false);
      await refetch();
    }
    if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
      toast.error(t("update.error", { field: selectedToken.token }));
      setSelectedToken(initialState);
      setShowDeleteDialog(false);
    }

    return result;
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState<CalendarToken>(initialState);

  const redigerToken = (calendarToken: CalendarToken) => {
    setSelectedToken(calendarToken);
    setShowAddEditDialog(true);
  };

  const fjernToken = (calendarToken: CalendarToken) => {
    setSelectedToken(calendarToken);
    setShowDeleteDialog(true);
  };

  const deleteToken = async () => {
    if (selectedToken?.id) {
      deleteCalendarToken(selectedToken.id);
    }
  };

  const submit = async (calendarToken: CalendarToken) => {
    const data = {
      ...calendarToken,
      token: calendarToken.token.replaceAll(/\s/g, "").toUpperCase(),
    };

    if (selectedToken.token) {
      updateCalendarToken(data);
    } else {
      addCalendarToken(data);
    }
  };

  const activeIcon = <GiCheckMark title={t("pages.tokens.active")} />;
  const inactiveIcon = <RiDeleteBin6Line title={t("pages.tokens.archived")} />;

  const columnHelper = createColumnHelper<CalendarToken>();
  const columns = [
    columnHelper.accessor("token", {
      header: t("pages.tokens.token"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("name", {
      header: t("pages.tokens.name"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("active", {
      header: t("pages.tokens.active"),
      cell: (info) => (info.getValue() ? activeIcon : inactiveIcon),
      enableColumnFilter: false,
      enableSorting: true,
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
                icon: ButtonType.EDIT,
                text: t("buttons.edit"),
                hidden: !currentUser || !hasAuthority(currentUser, "calendartoken:update"),
                onClick: () => redigerToken(row),
              },
              {
                icon: ButtonType.DELETE,
                text: t("buttons.delete"),
                color: "error",
                variant: "text",
                hidden:
                  !currentUser ||
                  !hasAuthority(currentUser, "calendartoken:delete") ||
                  (users ?? []).some((u) => u.calendarToken.some((ct) => ct.id === row.id)) ||
                  (calendars ?? []).some((c) => c.calendarToken.id === row.id),
                onClick: () => fjernToken(row),
              },
            ]}
          />
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
    }),
  ];

  if (!calendarTokens || isFetchingTokens || isFetchingUsers || isFetchingCalendars || !currentUser) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <H1>{t("pages.tokens.header")}</H1>
      {selectedToken && (
        <RemoveCalendarTokenModal
          calendarToken={selectedToken}
          isDeleting={isDeleting}
          show={showDeleteDialog}
          hide={() => {
            setShowDeleteDialog(false);
            setSelectedToken(initialState);
          }}
          callback={deleteToken}
        />
      )}
      <AddEditCalendarTokenModal
        calendarToken={selectedToken}
        isAdding={isAdding}
        isUpdating={isUpdating}
        tokens={calendarTokens}
        show={showAddEditDialog}
        hide={async () => {
          setShowAddEditDialog(false);
          setSelectedToken(initialState);
          await refetch();
        }}
        callback={submit}
      />
      <Table
        data={calendarTokens}
        columns={columns}
        actionButtons={
          <ActionKnapper
            buttons={[
              {
                text: t("buttons.add", { field: t("pages.tokens.token") }),
                variant: "contained",
                icon: ButtonType.NEW,
                hidden: !hasAuthority(currentUser, "calendartoken:create"),
                onClick: () => {
                  setSelectedToken(initialState);
                  setShowAddEditDialog(true);
                },
              },
            ]}
          />
        }
      />
    </>
  );
};
export default TokensPage;
