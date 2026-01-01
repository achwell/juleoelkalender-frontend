import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import { ButtonType } from "@/types/ButtonProps";
import { CalendarToken } from "@/types/generated";
import { useTranslation } from "react-i18next";

interface Props {
    calendarToken: CalendarToken;
    isDeleting: boolean;
    show: boolean;
    hide: () => void;
    callback: () => void;
}

const RemoveCalendarTokenModal = ({ calendarToken, isDeleting, show, hide, callback }: Props) => {
    const { t } = useTranslation();
    return (
        <ModalDialog show={show} hide={hide} title={t("delete.confirmdelete", { name: calendarToken.name })}>
            <>
                <p id="modal-modal-description" className="mt-2 text-gray-500">
                    {t("delete.confirmdeletetext", { name: calendarToken.name })}
                </p>
                <ActionKnapper
                    buttons={[
                        {
                            text: isDeleting
                                ? t("delete.deleting")
                                : t("delete.confirmdeletemessage", {
                                      name: calendarToken.name,
                                  }),
                            icon: ButtonType.DELETE,
                            onClick: callback,
                            disabled: isDeleting,
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
export default RemoveCalendarTokenModal;
