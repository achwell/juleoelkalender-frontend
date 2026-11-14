import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import AddEditBeerstyleModal from "@/components/modals/AddEditBeerstyleModal";
import RemoveBeerstyleModal from "@/components/modals/RemoveBeerstyleModal";
import Table from "@/components/table/Table";
import {
  useAddBeerStyleMutation,
  useDeleteBeerStyleMutation,
  useGetBeerStylesQuery,
  useUpdateBeerStyleMutation,
} from "@/redux/api/beerStyleApi";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { BeerStyle } from "@/types/generated";
import { handleErrorWithStatus, hasAuthority } from "@/utils";
import { createColumnHelper } from "@/components/table/tableTypes";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const initialState: BeerStyle | undefined = { id: uuidv4(), name: "" };
const BeerstylesPage = () => {
  const { t } = useTranslation();

  const [addBeerStyleRequest, { isLoading: isAdding }] = useAddBeerStyleMutation();
  const addBeerStyle = async (...args: Parameters<typeof addBeerStyleRequest>) => {
    const result = await addBeerStyleRequest(...args);

    if ("data" in result && result.data) {
      if (result.data) {
        toast.success(t("add.added", { field: result.data?.name }));
        setSelectedBeerstyle(result.data);
      }
      setShowAddEditDialog(false);
      await refetch();
    }
    if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
      toast.error(t("add.error", { field: args[0].name }));
      setSelectedBeerstyle(initialState);
      setShowDeleteDialog(false);
    }

    return result;
  };

  const [deleteBeerStyleRequest, { isLoading: isDeleting }] = useDeleteBeerStyleMutation();
  const deleteBeerStyle = async (...args: Parameters<typeof deleteBeerStyleRequest>) => {
    const result = await deleteBeerStyleRequest(...args);

    if ("data" in result) {
      toast.success(t("delete.deleted", { name: selectedBeerstyle?.name }));
      await refetch();
      setSelectedBeerstyle(initialState);
      setShowDeleteDialog(false);
    }
    if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
      toast.error(t("delete.error", { name: selectedBeerstyle?.name }));
      setSelectedBeerstyle(initialState);
      setShowDeleteDialog(false);
    }

    return result;
  };

  const [updateBeerStyleRequest, { isLoading: isUpdating }] = useUpdateBeerStyleMutation();
  const updateBeerStyle = async (...args: Parameters<typeof updateBeerStyleRequest>) => {
    const result = await updateBeerStyleRequest(...args);

    if ("data" in result && result.data) {
      if (result.data) {
        toast.success(t("update.updated", { field: result.data?.name }));
        setSelectedBeerstyle(result.data);
      }
      setShowAddEditDialog(false);
      await refetch();
    }
    if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
      toast.error(t("update.error", { field: selectedBeerstyle?.name }));
      setSelectedBeerstyle(initialState);
      setShowDeleteDialog(false);
    }

    return result;
  };

  const { currentUser } = useAppSelector((state) => state.authState);

  const { data: beerStyles, isFetching: isFetchingBeerStyles, refetch } = useGetBeerStylesQuery(currentUser?.id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddEditDialog, setShowAddEditDialog] = useState(false);
  const [selectedBeerstyle, setSelectedBeerstyle] = useState<BeerStyle | undefined>(undefined);

  const deleteStyle = async () => {
    if (selectedBeerstyle?.id) {
      deleteBeerStyle(selectedBeerstyle.id);
    }
  };

  const fjernBeerStyle = (beerStyle: BeerStyle) => {
    setSelectedBeerstyle(beerStyle);
    setShowDeleteDialog(true);
  };

  const redigerBeerStyle = (beerStyle: BeerStyle) => {
    setSelectedBeerstyle(beerStyle);
    setShowAddEditDialog(true);
  };

  const submit = async (beerStyle: BeerStyle) => {
    if (beerStyle.id === initialState.id) {
      addBeerStyle(beerStyle);
    } else {
      updateBeerStyle(beerStyle);
    }
  };

  const columnHelper = createColumnHelper<BeerStyle>();
  const colums = [
    columnHelper.accessor("name", {
      header: t("pages.beerstyles.beerstyle"),
      cell: (info) => info.getValue(),
      filterFn: "fuzzy",
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
                hidden: !currentUser || !hasAuthority(currentUser, "beerstyle:update"),
                onClick: () => redigerBeerStyle(row),
              },
              {
                icon: ButtonType.DELETE,
                text: t("buttons.delete"),
                color: "error",
                variant: "text",
                hidden: !currentUser || !hasAuthority(currentUser, "beerstyle:delete"),
                onClick: () => fjernBeerStyle(row),
              },
            ]}
          />
        );
      },
      enableColumnFilter: false,
      enableSorting: false,
    }),
  ];

  if (!beerStyles || isFetchingBeerStyles || !currentUser) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <H1>{t("pages.beerstyles.header")}</H1>
      {selectedBeerstyle && (
        <RemoveBeerstyleModal
          beerStyle={selectedBeerstyle}
          isDeleting={isDeleting}
          show={showDeleteDialog}
          hide={() => {
            setShowDeleteDialog(false);
            setSelectedBeerstyle(initialState);
          }}
          callback={deleteStyle}
        />
      )}
      <AddEditBeerstyleModal
        beerStyle={selectedBeerstyle}
        isAdding={isAdding}
        isUpdating={isUpdating}
        beerStyles={beerStyles}
        show={showAddEditDialog}
        hide={async () => {
          setShowAddEditDialog(false);
          setSelectedBeerstyle(initialState);
          await refetch();
        }}
        callback={submit}
      />
      <Table
        data={beerStyles}
        columns={colums}
        actionButtons={
          <ActionKnapper
            buttons={[
              {
                text: t("buttons.add", { field: t("pages.beerstyles.beerstyle") }),
                variant: "contained",
                icon: ButtonType.NEW,
                hidden: !hasAuthority(currentUser, "beerstyle:create"),
                onClick: () => {
                  setSelectedBeerstyle(initialState);
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
export default BeerstylesPage;
