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
import { handleError, hasAuthority } from "@/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const initialState: BeerStyle | undefined = { id: uuidv4(), name: "" };
const BeerstylesPage = () => {
    const { t } = useTranslation();

    const [
        addBeerStyle,
        {
            isLoading: isAdding,
            isSuccess: isSuccessAdding,
            data: newBeerStyle,
            isError: isErrorAdding,
            error: errorAdding,
        },
    ] = useAddBeerStyleMutation();

    const [
        deleteBeerStyle,
        { isLoading: isDeleting, isSuccess: isSuccessDelete, isError: isErrorDelete, error: errorDelete },
    ] = useDeleteBeerStyleMutation();

    const [
        updateBeerStyle,
        {
            isLoading: isUpdating,
            isSuccess: isSuccessUpdating,
            data: updatedBeerStyle,
            isError: isErrorUpdating,
            error: errorUpdating,
        },
    ] = useUpdateBeerStyleMutation();
    const { currentUser } = useAppSelector((state) => state.authState);

    const { data: beerStyles, isFetching: isFetchingBeerStyles, refetch } = useGetBeerStylesQuery(currentUser?.id);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddEditDialog, setShowAddEditDialog] = useState(false);
    const [selectedBeerstyle, setSelectedBeerstyle] = useState<BeerStyle | undefined>(undefined);

    useEffect(() => {
        const finish = async () => {
            toast.success(t("delete.deleted", { name: selectedBeerstyle?.name }));
            await refetch();
            setSelectedBeerstyle(initialState);
            setShowDeleteDialog(false);
        };
        if (!isDeleting) {
            if (isSuccessDelete) {
                finish();
            }
            if (isErrorDelete && errorDelete) {
                handleError(t, errorDelete);
                toast.error(t("delete.error", { name: selectedBeerstyle?.name }));
                setSelectedBeerstyle(initialState);
                setShowDeleteDialog(false);
            }
        }
    }, [isDeleting, isSuccessDelete, isErrorDelete, errorDelete]);

    useEffect(() => {
        const finish = async () => {
            if (newBeerStyle) {
                toast.success(t("add.added", { field: newBeerStyle?.name }));
                setSelectedBeerstyle(newBeerStyle);
            }
            setShowAddEditDialog(false);
            await refetch();
        };
        if (!isAdding) {
            if (isSuccessAdding && newBeerStyle) {
                finish();
            }
            if (isErrorAdding && errorAdding) {
                handleError(t, errorAdding);
                toast.error(t("add.error", { field: newBeerStyle?.name }));
                setSelectedBeerstyle(initialState);
                setShowDeleteDialog(false);
            }
        }
    }, [isAdding, isSuccessAdding, newBeerStyle, isErrorAdding, errorAdding]);

    useEffect(() => {
        const finish = async () => {
            if (updatedBeerStyle) {
                toast.success(t("update.updated", { field: updatedBeerStyle?.name }));
                setSelectedBeerstyle(updatedBeerStyle);
            }
            setShowAddEditDialog(false);
            await refetch();
        };
        if (!isUpdating) {
            if (isSuccessUpdating && updatedBeerStyle) {
                finish();
            }
            if (isErrorUpdating && errorUpdating) {
                handleError(t, errorUpdating);
                toast.error(t("update.error", { field: selectedBeerstyle?.name }));
                setSelectedBeerstyle(initialState);
                setShowDeleteDialog(false);
            }
        }
    }, [isUpdating, isSuccessUpdating, updatedBeerStyle, isErrorUpdating, errorUpdating]);

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
        if (beerStyle.id !== initialState.id) {
            updateBeerStyle(beerStyle);
        } else {
            addBeerStyle(beerStyle);
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

    if (!beerStyles || isFetchingBeerStyles || !currentUser) return <FullScreenLoader />;

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
                cols={colums}
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
