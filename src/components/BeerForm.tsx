import ActionKnapper from "@/components/ActionKnapper";
import InputAutocomplete from "@/components/form/InputAutocomplete";
import InputCheckbox from "@/components/form/InputCheckbox";
import InputDate from "@/components/form/InputDate";
import InputNumber from "@/components/form/InputNumber";
import InputText from "@/components/form/InputText";
import InputTextArea from "@/components/form/InputTextArea";
import { useAddBeerMutation, useUpdateBeerMutation } from "@/redux/api/beerApi";
import { setCurrentUser } from "@/redux/features/authSlice";
import { setBeerStyles } from "@/redux/features/beerStylesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import beerSchema from "@/schema/beerSchema";
import { ButtonType } from "@/types/ButtonProps";
import { Beer, User } from "@/types/generated";
import { handleError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Props {
    beer: Beer;
    user: User;
    from: string | null;
    isNew: boolean;
}

const BeerForm: FC<Props> = ({ beer, user, from, isNew }) => {
    const { i18n, t } = useTranslation();
    const { currentUser } = useAppSelector((state) => state.authState);
    const { beerStyles } = useAppSelector((state) => state.beerStylesState);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const resolver = zodResolver(beerSchema(t));
    const defaultValues = { ...beer, desiredDate: !beer.desiredDate ? undefined : beer.desiredDate };
    // @ts-ignore
    const methods = useForm<Beer>({ mode: "onChange", resolver, defaultValues });
    const {
        handleSubmit,
        formState: { isDirty },
        setValue,
        watch,
    } = methods;

    const { desiredDate } = watch();

    const [
        addBeer,
        { isLoading: isAdding, isSuccess: isSuccessAdd, data: newBeer, isError: isAddError, error: addError },
    ] = useAddBeerMutation();
    const [
        updateBeer,
        {
            isLoading: isUpdating,
            isSuccess: isSuccessUpdate,
            data: updatedBeer,
            isError: isUpdateError,
            error: updateError,
        },
    ] = useUpdateBeerMutation();

    const addNewBeer = (newBeer: Beer) => {
        if (user && currentUser && user.id === currentUser.id) {
            const beers = user.beers;
            dispatch(
                setCurrentUser({
                    ...user,
                    beers: [...beers, newBeer],
                })
            );
        }
        toast.success(
            t("add.added", {
                field: newBeer.name,
            })
        );
        navigate(from ?? "/beers");
    };

    const updateExistingBeer = (updatedBeer: Beer) => {
        if (user && currentUser && user.id === currentUser.id) {
            const beers = user.beers.map((b) => (b.id !== updatedBeer.id ? b : updatedBeer));
            dispatch(
                setCurrentUser({
                    ...user,
                    beers,
                })
            );
        }
        toast.success(
            t("update.updated", {
                field: updatedBeer.name,
            })
        );
        navigate(from ?? "/beers", {
            replace: true,
            relative: "route",
        });
    };

    useEffect(() => {
        const finish = async () => {
            if (!isAdding) {
                if (isSuccessAdd && newBeer) {
                    addNewBeer(newBeer);
                } else if (isAddError && addError) {
                    handleError(t, addError);
                }
            }
        };
        finish();
    }, [isAdding, isSuccessAdd, isAddError]);

    useEffect(() => {
        const finish = async () => {
            if (!isUpdating) {
                if (isSuccessUpdate && updatedBeer) {
                    updateExistingBeer(updatedBeer);
                } else if (isUpdateError && updateError) {
                    handleError(t, updateError);
                }
            }
        };
        finish();
    }, [isUpdating, isSuccessUpdate, isUpdateError, i18n.language]);

    const create = (beerInput: Partial<Beer>) => {
        const { id, ...rest } = {
            ...beer,
            ...beerInput,
            userId: user.id,
        };
        addBeer(rest);
    };

    const update = (beerInput: Partial<Beer>) => {
        updateBeer({
            ...beer,
            ...beerInput,
        });
    };

    const updateBeerStyles = async (style: string, beerStyles: string[]) => {
        if (!!style && !beerStyles.includes(style)) {
            const newBeerStyles = [style, ...beerStyles].sort((a, b) => {
                const styleA = a.toUpperCase();
                const styleB = b.toUpperCase();
                if (styleA < styleB) {
                    return -1;
                }
                if (styleA > styleB) {
                    return 1;
                }
                return 0;
            });
            dispatch(setBeerStyles(newBeerStyles));
            return newBeerStyles;
        }
        return beerStyles;
    };

    const onSubmit: SubmitHandler<Partial<Beer>> = (beerToSave) => {
        const data = {
            ...beerToSave,
            desiredDate,
        };

        const style = beerToSave.style ?? "";
        if (!!style && !beerStyles.includes(style)) {
            updateBeerStyles(style, beerStyles);
        }

        if (isNew) {
            create(data);
        } else {
            update(data);
        }
    };

    const callback = (value: string) => updateBeerStyles(value, beerStyles).then(() => setValue("style", value));

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-[50vw] mx-auto space-y-4">
                <div className="space-y-2">
                    <InputText name="name" label={t("beer.name")} required={true} />
                    <InputAutocomplete
                        name="style"
                        label={t("beer.style")}
                        required={true}
                        callback={callback}
                        options={beerStyles}
                    />
                    <InputTextArea name="description" label={t("beer.description")} maxLength={255} />
                </div>
                <div className="space-y-2">
                    <InputNumber
                        name="abv"
                        label={t("beer.abv")}
                        min={0}
                        required={true}
                        max={100}
                        step={0.1}
                        startAdornment={true}
                    />
                    <InputNumber
                        name="ibu"
                        label={t("beer.ibu")}
                        min={0}
                        required={true}
                        max={100}
                        step={0.1}
                        startAdornment={true}
                    />
                    <InputNumber
                        name="ebc"
                        label={t("beer.ebc")}
                        min={0}
                        required={true}
                        max={100}
                        step={0.1}
                        startAdornment={true}
                    />
                </div>
                <div className="space-y-2">
                    <InputText name="recipe" label={t("beerform.recipelink")} />
                    <InputText name="untapped" label={t("beerform.untappedlink")} />
                </div>
                <div className="space-y-2">
                    <InputCheckbox name="archived" label={t("beer.archived")} />
                </div>
                <div className="space-y-2">
                    <InputDate name="brewedDate" label={t("beer.breweddate")} />
                    <InputDate name="bottleDate" label={t("beer.bottledate")} />
                </div>
                <div className="space-y-2">
                    <InputNumber min={1} max={24} name="desiredDate" label={t("beer.desiredDate")} />
                </div>
                <ActionKnapper
                    buttons={[
                        {
                            text: (isAdding ?? isUpdating) ? t("buttons.saving") : t("buttons.save"),
                            icon: ButtonType.SUBMIT,
                            variant: "contained",
                            disabled: isAdding ?? isUpdating ?? !isDirty,
                        },
                        {
                            text: t("buttons.cancel"),
                            icon: ButtonType.CANCEL,
                            onClick: () => {
                                const url = from ?? (beer.id === "" ? "/beers" : `/beers/details/${beer.id}`);
                                return navigate(url);
                            },
                        },
                    ]}
                />
            </form>
        </FormProvider>
    );
};
export default BeerForm;
