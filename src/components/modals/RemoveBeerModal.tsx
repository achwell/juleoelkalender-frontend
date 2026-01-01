import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import { ButtonType } from "@/types/ButtonProps";
import { useTranslation } from "react-i18next";

interface Props {
    beerName?: string;
    calendarName?: string;
    calendarYear?: number;
    isDeletingBeerCalendar: boolean;
    show: boolean;
    hide: () => void;
    callback: () => void;
}

const RemoveBeerModal = ({
    beerName,
    calendarName,
    calendarYear,
    isDeletingBeerCalendar,
    show,
    hide,
    callback,
}: Props) => {
    const { t } = useTranslation();
    return (
        <ModalDialog show={show} hide={hide} title={`Vil du fjerne ${beerName}`}>
            <>
                <p id="modal-modal-description" className="mt-2 text-gray-500">
                    {t("pages.calendar.admin.beerremove", {
                        beer: beerName,
                        year: calendarName,
                        calendar: calendarYear,
                    })}
                    Er du sikker på at du vil fjerne {beerName} fra kalender {calendarYear}: {calendarName}?
                </p>
                <ActionKnapper
                    buttons={[
                        {
                            text: isDeletingBeerCalendar
                                ? t("delete.deleting")
                                : t("delete.confirmdeletemessage", {
                                      name: beerName,
                                  }),
                            icon: ButtonType.DELETE,
                            onClick: callback,
                            disabled: isDeletingBeerCalendar,
                        },
                        {
                            text: t("buttons.cancel"),
                            icon: ButtonType.CANCEL,
                            onClick: hide,
                        },
                    ]}
                />
            </>
        </ModalDialog>
    );
};
export default RemoveBeerModal;
