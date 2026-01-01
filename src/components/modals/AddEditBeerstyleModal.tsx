import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import InputText from "@/components/form/InputText";
import beerStyleSchema from "@/schema/beerStyleSchema";
import { ButtonType } from "@/types/ButtonProps";
import { BeerStyle } from "@/types/generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
    beerStyle?: BeerStyle;
    isAdding: boolean;
    isUpdating: boolean;
    beerStyles: BeerStyle[];
    show: boolean;
    hide: () => void;
    callback: (beerStyle: BeerStyle) => void;
}

const AddEditBeerstyleModal = ({ beerStyle, isAdding, isUpdating, beerStyles, show, hide, callback }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<BeerStyle>({
        mode: "onChange",
        resolver: zodResolver(beerStyleSchema(t, beerStyles)),
        defaultValues: beerStyle,
    });
    const {
        handleSubmit,
        formState: { isDirty },
        reset,
    } = methods;

    useEffect(() => {
        reset(beerStyle);
    }, [reset, beerStyle]);

    return (
        <ModalDialog
            show={show}
            hide={hide}
            title={!!beerStyle && !!beerStyle.id ? t("pages.beerstyles.edit") : t("pages.beerstyles.add")}
        >
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(callback)} autoComplete="off" className="w-[50vw] mx-auto">
                    <div className="flex flex-col justify-start items-start">
                        <InputText name="name" label={t("pages.beerstyles.beerstyle")} required={true} />
                        <ActionKnapper
                            buttons={[
                                {
                                    text: (isAdding ?? isUpdating) ? t("buttons.saving") : t("buttons.save"),
                                    icon: ButtonType.SUBMIT,
                                    onClick: () => {},
                                    disabled: isAdding ?? isUpdating ?? !isDirty,
                                },
                                {
                                    text: t("buttons.cancel"),
                                    icon: ButtonType.CANCEL,
                                    onClick: hide,
                                },
                            ]}
                        />
                    </div>
                </form>
            </FormProvider>
        </ModalDialog>
    );
};
export default AddEditBeerstyleModal;
