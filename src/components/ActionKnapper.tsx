import {
    getErrorContainedButton,
    getIconButton,
    getIconSubmitButton,
    getPrimaryContainedButton,
    getPrimaryTextButton,
    getPrimaryTextSubmitButton,
    getSecondaryContainedButton,
    getSecondaryTextButton,
} from "@/buttonUtils";
import ExcelIcon from "@/components/ExcelIcon";
import ButtonProps, { ButtonType } from "@/types/ButtonProps";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaLockOpen, FaPlus } from "react-icons/fa6";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { MdOutlineReviews, MdVisibility } from "react-icons/md";
import { RiDeleteBin6Line, RiEdit2Line, RiLockPasswordLine, RiLoginBoxLine, RiSaveLine } from "react-icons/ri";

interface Props {
    id?: string;
    buttons: (ButtonProps | undefined)[];
}

const ActionKnapper: FC<Props> = ({ id = "", buttons }) => {
    const { t } = useTranslation();

    return (
        <div id={id} className="flex flex-row justify-start items-start px-2 my-2">
            <div
                className="hidden sm:flex md:flex lg:flex xl:flex items-start self-start w-full space-x-2"
                id="button-group"
                role="group"
                aria-label="Outlined primary button group"
            >
                {buttons
                    .filter((b) => !!b)
                    .map((button, index) => {
                        if (!button) {
                            return null;
                        }
                        if (button.hidden) {
                            return null;
                        }
                        switch (button.icon) {
                            case ButtonType.BACK:
                                return getSecondaryContainedButton(index, button, <FaArrowLeft />);
                            case ButtonType.CANCEL:
                            case ButtonType.UNLOCK:
                                return getSecondaryContainedButton(index, button);
                            case ButtonType.DELETE:
                                return getErrorContainedButton(index, button);
                            case ButtonType.EXCEL:
                                return getSecondaryTextButton(index, button, <ExcelIcon />);
                            case ButtonType.LOGIN:
                                return getPrimaryContainedButton(index, button);
                            case ButtonType.SUBMIT:
                                return getPrimaryTextSubmitButton(index, button);
                            case ButtonType.PASSWORD:
                            case ButtonType.REGISTER:
                            case ButtonType.VIEW:
                            case ButtonType.EDIT:
                            case ButtonType.NEW:
                            case ButtonType.REVIEWS:
                                return getPrimaryTextButton(index, button);
                            case ButtonType.UP:
                                return getSecondaryContainedButton(index, button, <FaArrowCircleUp />);
                            case ButtonType.DOWN:
                                return getSecondaryContainedButton(index, button, <FaArrowCircleDown />);
                            default:
                                return null;
                        }
                    })}
            </div>
            <div
                className="flex sm:hidden md:hidden lg:hidden xl:hidden items-start self-start w-full space-x-2"
                id="button-group"
                role="group"
                aria-label="Outlined primary button group"
            >
                {buttons
                    .filter((b) => !!b)
                    .map((button, index) => {
                        if (!button) return null;
                        const { icon, text } = button;
                        switch (icon) {
                            case ButtonType.BACK:
                                return getIconButton(index, button, <FaArrowLeft title={text ?? t("buttons.back")} />);
                            case ButtonType.CANCEL:
                                return getIconButton(index, button, <GiCancel title={text ?? t("buttons.cancel")} />);
                            case ButtonType.DELETE:
                                return getIconButton(
                                    index,
                                    button,
                                    <RiDeleteBin6Line title={text ?? t("buttons.delete")} />
                                );
                            case ButtonType.EDIT:
                                return getIconButton(index, button, <RiEdit2Line title={text ?? t("buttons.edit")} />);
                            case ButtonType.EXCEL:
                                return getIconButton(
                                    index,
                                    button,
                                    <ExcelIcon titleaccess={text ?? t("buttons.excel")} />
                                );
                            case ButtonType.LOGIN:
                                return getIconSubmitButton(
                                    index,
                                    button,
                                    <RiLoginBoxLine title={text ?? t("buttons.login")} />
                                );
                            case ButtonType.NEW:
                                return getIconButton(
                                    index,
                                    button,
                                    <FaPlus title={text ?? t("buttons.add", { field: "" })} />
                                );
                            case ButtonType.PASSWORD:
                                return getIconButton(
                                    index,
                                    button,
                                    <RiLockPasswordLine title={text ?? t("buttons.password")} />
                                );
                            case ButtonType.REGISTER:
                                return getIconButton(
                                    index,
                                    button,
                                    <RiSaveLine title={text ?? t("buttons.register")} />
                                );
                            case ButtonType.REVIEWS:
                                return getIconButton(
                                    index,
                                    button,
                                    <MdOutlineReviews title={text ?? t("buttons.reviews")} />
                                );
                            case ButtonType.SUBMIT:
                                return getIconButton(index, button, <RiSaveLine title={text ?? t("buttons.submit")} />);
                            case ButtonType.VIEW:
                                return getIconButton(index, button, <MdVisibility title={text ?? t("buttons.view")} />);
                            case ButtonType.UNLOCK:
                                return getIconButton(index, button, <FaLockOpen title={text ?? t("buttons.unlock")} />);
                            case ButtonType.UP:
                                return getIconButton(
                                    index,
                                    button,
                                    <FaArrowCircleUp title={text ?? t("buttons.move.up")} />
                                );
                            case ButtonType.DOWN:
                                return getIconButton(
                                    index,
                                    button,
                                    <FaArrowCircleDown title={text ?? t("buttons.move.down")} />
                                );
                            default:
                                return null;
                        }
                    })}
            </div>
        </div>
    );
};
export default ActionKnapper;
