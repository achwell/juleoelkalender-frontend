import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import InputCheckbox from "@/components/form/InputCheckbox";
import InputNumber from "@/components/form/InputNumber";
import InputText from "@/components/form/InputText";
import { useAddCalendarMutation, useDeleteCalendarMutation, useUpdateCalendarMutation } from "@/redux/api/calendarApi";
import { useAppSelector } from "@/redux/hooks";
import calendarSchema from "@/schema/calendarSchema";
import { ButtonType } from "@/types/ButtonProps";
import CalendarId from "@/types/CalendarId";
import { Calendar } from "@/types/generated";
import { handleError, hasAuthority } from "@/utils";
import { Resolver } from "@hookform/resolvers/ajv";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Props {
    calendar: Calendar;
    existingCalendars: CalendarId[];
    callback: () => void;
}

const CalendarForm: FC<Props> = ({ calendar, existingCalendars = [], callback }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.authState);

    const schema = calendarSchema(t, existingCalendars);
    // @ts-ignore
    const resolver: Resolver<Calendar> = zodResolver(schema);
    const methods = useForm<Calendar>({
        mode: "onChange",
        resolver: resolver,
        defaultValues: { ...calendar },
    });
    const { handleSubmit } = methods;

    const [
        addCalendar,
        { isLoading: isAdding, isSuccess: isSuccessAdding, isError: isErrorAdding, error: errorAdding },
    ] = useAddCalendarMutation();
    const [
        deleteCalendar,
        { isLoading: isDeleting, isSuccess: isSuccessDeleting, isError: isErrorDeleting, error: errorDeleting },
    ] = useDeleteCalendarMutation();
    const [
        updateCalendar,
        { isLoading: isUpdating, isSuccess: isSuccessUpdating, isError: isErrorUpdating, error: errorUpdating },
    ] = useUpdateCalendarMutation();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (!isAdding) {
            if (isSuccessAdding) {
                toast.success(t("calendarform.created", { name: calendar.name }));
                if (callback) {
                    callback();
                }
            } else if (isErrorAdding && errorAdding) {
                handleError(t, errorAdding);
            }
        }
    }, [isAdding, isSuccessAdding, isErrorAdding, errorAdding, calendar.name, callback]);

    const deletedOK = async () => {
        setShowDeleteDialog(false);
        toast.success(t("calendarform.deleted", { year: calendar.year, name: calendar.name }));
        navigate("/calendar");
    };

    useEffect(() => {
        if (!isDeleting) {
            if (isSuccessDeleting) {
                deletedOK();
            } else if (isErrorDeleting && errorDeleting) {
                handleError(t, errorDeleting);
            }
        }
    }, [isDeleting, isSuccessDeleting, isErrorDeleting, errorDeleting, deletedOK]);

    useEffect(() => {
        if (!isUpdating) {
            if (isSuccessUpdating) {
                toast.success(t("calendarform.updated", { name: calendar.name }));
                if (callback) {
                    callback();
                }
            } else if (isErrorUpdating && errorUpdating) {
                handleError(t, errorUpdating);
            }
        }
    }, [isUpdating, isSuccessUpdating, isErrorUpdating, errorUpdating, calendar.name, callback]);

    const onSubmit = async (data: Calendar) => {
        const { id, year, name, archived, published, calendarToken, beerCalendars } = data;
        const newId = id === "N/A" ? undefined : id;

        const existingCalendar = existingCalendars?.filter((c) => c.year === year && c.name === name).at(0);
        if (!newId || id == "N/A") {
            if (existingCalendar) {
                toast.error(t("combinationExistsNameYear", { name, year }));
                return;
            }
            await addCalendar({
                id: newId,
                year,
                name,
                archived,
                published,
                calendarToken,
                beerCalendars,
            });
        } else {
            if (existingCalendar && existingCalendar.id !== newId) {
                toast.error(t("combinationExistsNameYear", { name, year }));
                return;
            }
            await updateCalendar({
                ...calendar,
                ...data,
            });
        }
    };

    if (!currentUser) return null;
    return (
        <>
            <ModalDialog
                show={showDeleteDialog}
                hide={() => setShowDeleteDialog(false)}
                title={t("calendarform.confirmdelete", { year: calendar.year, name: calendar.name })}
            >
                <>
                    <p id="modal-modal-description" className="mt-2">
                        {t("calendarform.confirmdeletetext", { year: calendar.year, name: calendar.name })}
                    </p>
                    <ActionKnapper
                        buttons={[
                            {
                                text: isDeleting
                                    ? t("delete.deleting")
                                    : t("delete.confirmdeletemessage", { name: `${calendar.year}: ${calendar.name}` }),
                                icon: ButtonType.DELETE,
                                onClick: () => deleteCalendar(calendar.id!!),
                                hidden: !hasAuthority(currentUser, "calendar:delete"),
                                disabled: isDeleting,
                            },
                            {
                                text: t("buttons.cancel"),
                                icon: ButtonType.CANCEL,
                                onClick: () => setShowDeleteDialog(false),
                            },
                        ]}
                    />
                </>
            </ModalDialog>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="w-[50vw]">
                    <div className="flex flex-col space-y-2">
                        <InputText name="name" label={t("calendarform.name")} required={true} />
                        <InputNumber name="year" label={t("calendarform.year")} required={true} />
                        <InputCheckbox name="published" label={t("calendarform.published")} />
                        <InputCheckbox name="archived" label={t("calendarform.archived")} />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <ActionKnapper
                            buttons={[
                                {
                                    icon: ButtonType.BACK,
                                    text: t("buttons.back"),
                                    onClick: () =>
                                        navigate("/calendar", {
                                            replace: true,
                                            relative: "route",
                                        }),
                                },
                                {
                                    icon: ButtonType.SUBMIT,
                                    text: isAdding
                                        ? t("buttons.creating")
                                        : isUpdating
                                          ? t("buttons.updating")
                                          : t("buttons.save"),
                                    variant: "contained",
                                    hidden: !hasAuthority(
                                        currentUser,
                                        !calendar.id ? "calendar:create" : "calendar:update"
                                    ),
                                    onClick: () => {},
                                },
                                {
                                    icon: ButtonType.DELETE,
                                    text: t("buttons.delete"),
                                    onClick: () => setShowDeleteDialog(true),
                                    disabled: !calendar.id,
                                    hidden: !calendar.id || !hasAuthority(currentUser, "calendar:delete"),
                                },
                            ]}
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    );
};
export default CalendarForm;
