import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import ModalDialog from "@/components/ModalDialog";
import H1 from "@/components/layout/H1";
import { useDeleteBeerMutation, useGetBeerQuery } from "@/redux/api/beerApi";
import { useGetBeerCalendarsQuery } from "@/redux/api/beerCalendarApi";
import { setCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { handleError } from "@/utils";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";

const BeerDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.authState);
    const {
        data: beer,
        isFetching,
        refetch,
    } = useGetBeerQuery(Array.isArray(id) ? id[0] : (id as string), {
        skip: !(Array.isArray(id) ? id[0] : (id as string)),
    });
    const { data: beerCalendars, isFetching: isFetchingGetBeerCalendars } = useGetBeerCalendarsQuery();
    const [deleteBeer, { isLoading: isDeleting, isSuccess: isSuccessDelete, isError, error }] = useDeleteBeerMutation();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [canDelete, setCanDelete] = useState(false);
    const brewedDate = typeof beer?.brewedDate === "string" ? parseISO(beer?.brewedDate) : beer?.brewedDate;
    const bottleDate = typeof beer?.bottleDate === "string" ? parseISO(beer?.bottleDate) : beer?.bottleDate;

    useEffect(() => {
        if (beerCalendars && beer) {
            setCanDelete(!beerCalendars.map((bc) => bc.beer.id).includes(beer.id));
        }
    }, [beer, beerCalendars]);

    useEffect(() => {
        const finish = async () => {
            if (!!currentUser && !isDeleting) {
                if (isSuccessDelete && beer) {
                    if (beer.brewer.id === currentUser.id) {
                        const beers = currentUser.beers.filter((b) => b.id !== beer.id);
                        dispatch(setCurrentUser({ ...currentUser, beers }));
                    }
                    toast.success(t("delete.deleted", { name: beer.name }));
                    refetch();
                } else if (isError && error) {
                    handleError(t, error);
                }
            }
        };
        finish();
    }, [id, currentUser]);

    const remove = () => {
        if (!beer) {
            return;
        }
        setShowDeleteDialog(false);
        navigate(from ?? "/beers");
        deleteBeer(beer.id);
    };

    if (isFetching || isFetchingGetBeerCalendars || !currentUser || !beer) {
        return <FullScreenLoader />;
    }

    return (
        <>
            <H1>{beer.name}</H1>
            <ModalDialog
                show={showDeleteDialog}
                hide={() => setShowDeleteDialog(false)}
                title={t("delete.confirmdelete", { name: beer.name })}
            >
                <p id="modal-modal-description" className="mt-2">
                    {t("delete.confirmdeletemessage", { name: beer.name })}
                </p>
                <ActionKnapper
                    buttons={[
                        {
                            icon: ButtonType.CANCEL,
                            onClick: () => setShowDeleteDialog(false),
                            text: t("buttons.cancel"),
                        },
                        {
                            icon: ButtonType.DELETE,
                            onClick: remove,
                            text: isDeleting
                                ? t("delete.deleting")
                                : t("delete.confirmdeletebutton", { name: beer.name }),
                        },
                    ]}
                />
            </ModalDialog>
            <div>
                <div className="overflow-x-auto mt-2 mb-2 bg-white shadow-md rounded-lg">
                    <table className="min-w-full text-sm text-gray-700 border-collapse">
                        <tbody>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.style")}</td>
                                <td className="px-4 py-2">{beer?.style}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.description")}</td>
                                <td className="px-4 py-2">{beer?.description}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.abv")}</td>
                                <td className="px-4 py-2">{beer?.abv}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.ibu")}</td>
                                <td className="px-4 py-2">{beer?.ibu}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.ebc")}</td>
                                <td className="px-4 py-2">{beer?.ebc}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.recipe")}</td>
                                <td className="px-4 py-2 font-medium">{beer?.recipe}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.untapped")}</td>
                                <td className="px-4 py-2">{beer?.untapped}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.archived")}</td>
                                <td className="px-4 py-2">{beer.archived ? t("common.yes") : t("common.no")}</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.breweddate")}</td>
                                <td className="px-4 py-2">
                                    {brewedDate ? format(brewedDate, t("common.dateformat")) : ""}
                                </td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.bottledate")}</td>
                                <td className="px-4 py-2">
                                    {bottleDate ? format(bottleDate, t("common.dateformat")) : ""}
                                </td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td className="px-4 py-2 font-medium">{t("beer.desiredDate")}</td>
                                <td className="px-4 py-2">{beer?.desiredDate}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ActionKnapper
                    buttons={[
                        {
                            icon: ButtonType.BACK,
                            variant: "contained",
                            onClick: () => navigate(from ?? "/beers"),
                            text: t("buttons.back"),
                        },
                        {
                            icon: ButtonType.EDIT,
                            variant: "contained",
                            onClick: () => navigate(`/beers/edit/${beer.id}?from=${from}`),
                            text: t("buttons.edit"),
                        },
                        {
                            icon: ButtonType.DELETE,
                            variant: "contained",
                            onClick: () => setShowDeleteDialog(true),
                            text: t("buttons.delete"),
                            disabled: !canDelete,
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default BeerDetailsPage;
