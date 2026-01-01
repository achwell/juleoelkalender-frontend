import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import InputNumber from "@/components/form/InputNumber";
import InputSelect from "@/components/form/InputSelect";
import beerCalendarSchema from "@/schema/beerCalendarSchema";
import { ButtonType } from "@/types/ButtonProps";
import { Beer, BeerCalendar, Calendar } from "@/types/generated";
import { Resolver } from "@hookform/resolvers/ajv";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
    calendar: Calendar;
    beers: Beer[];
    occupiedDays: number[];
    initialDay: number;
    isAddingBeerCalendar: boolean;
    show: boolean;
    hide: () => void;
    callback: (beerCalendar: BeerCalendar) => void;
}

const AddBeerModal = ({
    calendar,
    beers,
    occupiedDays,
    initialDay,
    isAddingBeerCalendar,
    show,
    hide,
    callback,
}: Props) => {
    const { t } = useTranslation();

    const defaultValues = {
        id: "N/A",
        calendar,
        day: initialDay,
        beer: undefined,
    };

    const schema = beerCalendarSchema(t, occupiedDays);
    // @ts-ignore
    const resolver: Resolver<BeerCalendar> = zodResolver(schema);
    const methods = useForm<BeerCalendar>({
        defaultValues,
        mode: "onChange",
        resolver: resolver,
    });
    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (!!calendar && !!beers && beers.length > 0) {
            reset({
                id: undefined,
                calendar,
                day: initialDay,
                beer: beers[0],
            });
        }
    }, [beers, calendar, initialDay]);

    const addBeer = (data: BeerCalendar) => {
        callback({ ...data, id: "" });
        reset();
    };

    const cancel = () => {
        reset(defaultValues);
        hide();
    };

    return (
        <ModalDialog show={show} hide={hide} title={t("pages.calendar.admin.addbeermodal.title")}>
            <p id="modal-modal-description" className="mt-2 text-gray-500">
                {t("pages.calendar.admin.addbeermodal.ingress")}
            </p>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(addBeer)} autoComplete="off" className="w-[50vw] mx-auto">
                    <div className="flex flex-col justify-start items-start">
                        <InputSelect
                            name="beerId"
                            label={t("pages.calendar.admin.addbeermodal.choosebeer")}
                            selectItems={beers.map((beer) => ({
                                key: beer.id ?? "",
                                value:
                                    beer.name +
                                    (beer.desiredDate
                                        ? t("pages.calendar.admin.addbeermodal.wantdate", {
                                              desiredDate: beer.desiredDate,
                                          })
                                        : ""),
                            }))}
                        />
                        <InputNumber
                            name="day"
                            label={t("pages.calendar.admin.addbeermodal.day")}
                            required={true}
                            step={1}
                            min={1}
                            max={24}
                        />
                        <ActionKnapper
                            buttons={[
                                {
                                    text: isAddingBeerCalendar ? t("buttons.saving") : t("buttons.save"),
                                    icon: ButtonType.SUBMIT,
                                    variant: "contained",
                                    onClick: () => {},
                                    disabled: isAddingBeerCalendar,
                                },
                                {
                                    text: t("buttons.cancel"),
                                    icon: ButtonType.CANCEL,
                                    onClick: cancel,
                                },
                            ]}
                        />
                    </div>
                </form>
            </FormProvider>
        </ModalDialog>
    );
};
export default AddBeerModal;
