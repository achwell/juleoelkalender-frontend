import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import InputCheckbox from "@/components/form/InputCheckbox";
import InputText from "@/components/form/InputText";
import calendarTokenSchema from "@/schema/calendarTokenSchema";
import { ButtonType } from "@/types/ButtonProps";
import { CalendarToken } from "@/types/generated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface Props {
    calendarToken: CalendarToken;
    isAdding: boolean;
    isUpdating: boolean;
    tokens: CalendarToken[];
    show: boolean;
    hide: () => void;
    callback: (calendarToken: CalendarToken) => void;
}

const AddEditCalendarTokenModal = ({ calendarToken, isAdding, isUpdating, tokens, show, hide, callback }: Props) => {
    const { t } = useTranslation();

    const methods = useForm<CalendarToken>({
        mode: "onChange",
        resolver: zodResolver(calendarTokenSchema(t, tokens)),
        defaultValues: calendarToken,
    });
    const {
        handleSubmit,
        formState: { isDirty },
        reset,
    } = methods;

    useEffect(() => {
        reset(calendarToken);
    }, [reset, calendarToken]);

    return (
        <ModalDialog show={show} hide={hide} title={calendarToken.id ? t("pages.tokens.edit") : t("pages.tokens.add")}>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(callback)} autoComplete="off" className="w-[50vw] mx-auto">
                    <div className="flex flex-col justify-start items-start">
                        <InputText name="token" label={t("pages.tokens.token")} required={true} />
                        <InputText name="name" label={t("pages.tokens.name")} required={true} />
                        <InputCheckbox name="active" label={t("pages.tokens.active")} />
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
export default AddEditCalendarTokenModal;
