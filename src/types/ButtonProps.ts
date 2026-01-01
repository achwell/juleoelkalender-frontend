export enum ButtonType {
    BACK,
    CANCEL,
    DELETE,
    EDIT,
    EXCEL,
    LOGIN,
    NEW,
    PASSWORD,
    REGISTER,
    REVIEWS,
    SUBMIT,
    VIEW,
    UNLOCK,
    UP,
    DOWN,
}
export type BtnColor = "primary" | "secondary" | "error";
export type BtnVariant = "text" | "contained";
export type BtnType = "submit" | "reset" | "button";

export default interface ButtonProps {
    text?: string;
    onClick?: () => void;
    icon: ButtonType;
    color?: BtnColor;
    variant?: BtnVariant;
    type?: BtnType;
    disabled?: boolean;
    hidden?: boolean;
}
