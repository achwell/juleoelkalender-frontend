import ButtonProps, { BtnColor, BtnType, BtnVariant } from "@/types/ButtonProps";
import clsx from "clsx";
import { JSX } from "react";

export const getPrimaryContainedButton = (
    index: number,
    { color, disabled, onClick, text, type, variant }: ButtonProps,
    icon?: JSX.Element
) => {
    return getButton(
        index,
        color ?? "primary",
        variant ?? "contained",
        type ?? "button",
        onClick,
        disabled,
        <>
            {icon ? icon : null}
            {text}
        </>
    );
};

export const getPrimaryTextSubmitButton = (
    index: number,
    { color, disabled, onClick, text, type, variant }: ButtonProps,
    icon?: JSX.Element
) => {
    return getButton(
        index,
        color ?? "primary",
        variant ?? "text",
        type ?? "submit",
        onClick,
        disabled,
        <>
            {icon ? icon : null}
            {text}
        </>
    );
};

export const getPrimaryTextButton = (
    index: number,
    { color, disabled, onClick, text, type, variant }: ButtonProps,
    icon?: JSX.Element
) => {
    return getButton(
        index,
        color ?? "primary",
        variant ?? "text",
        type ?? "button",
        onClick,
        disabled,
        <>
            {icon ? icon : null}
            {text}
        </>
    );
};

export const getSecondaryContainedButton = (
    index: number,
    { color, disabled, onClick, text, type, variant }: ButtonProps,
    icon?: JSX.Element
) => {
    return getButton(
        index,
        color ?? "secondary",
        variant ?? "contained",
        type ?? "button",
        onClick,
        disabled,
        <>
            {icon ? icon : null}
            {text}
        </>
    );
};

export const getSecondaryTextButton = (
    index: number,
    { color, disabled, onClick, text, type, variant }: ButtonProps,
    icon?: JSX.Element
) => {
    return getButton(
        index,
        color ?? "secondary",
        variant ?? "text",
        type ?? "button",
        onClick,
        disabled,
        <>
            {icon ? icon : null}
            {text}
        </>
    );
};
export const getErrorContainedButton = (
    index: number,
    { color, disabled, onClick, text, type, variant }: ButtonProps,
    icon?: JSX.Element
) => {
    return getButton(
        index,
        color ?? "error",
        variant ?? "contained",
        type ?? "button",
        onClick,
        disabled,
        <>
            {icon ? icon : null}
            {text}
        </>
    );
};

export const getIconButton = (index: number, { disabled, onClick, type }: ButtonProps, icon: JSX.Element) => {
    return onClick && !disabled
        ? getIconButtonWithOnClick(index, type ?? "button", onClick, icon)
        : getIconButtonNoOnClick(index, type ?? "button", icon);
};

export const getIconSubmitButton = (index: number, { disabled, onClick, type }: ButtonProps, icon: JSX.Element) => {
    return onClick && !disabled
        ? getIconButtonWithOnClick(index, type ?? "submit", type !== "submit" ? onClick : undefined, icon)
        : getIconButtonNoOnClick(index, type ?? "submit", icon);
};

const getButton = (
    index: number,
    color: BtnColor,
    variant: BtnVariant,
    type: BtnType,
    onClick: (() => void) | undefined,
    disabled: boolean | undefined,
    content: JSX.Element
) => {
    return onClick && type !== "submit"
        ? getButtonWithOnClick(index, color, variant, type, onClick, !!disabled, content)
        : getButtonNoOnClick(index, color, variant, type, !!disabled, content);
};

const getButtonWithOnClick = (
    index: number,
    color: BtnColor,
    variant: BtnVariant,
    type: BtnType,
    onClick: () => void,
    disabled: boolean,
    content: JSX.Element
) => {
    if (variant === "text") {
        return (
            <button
                key={`b-${index}`}
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={clsx(
                    "inline-flex items-center bg-transparent text-sm px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap",
                    { "text-blue-600 hover:text-blue-800 focus:ring-blue-500": color === "primary" },
                    { "text-green-600 hover:text-green-700 focus:ring-green-500": color === "secondary" },
                    { "text-red-600 hover:text-red-700 focus:ring-red-500": color === "error" }
                )}
            >
                {content}
            </button>
        );
    }

    return (
        <button
            key={`b-${index}`}
            type={type}
            className={clsx(
                "inline-flex items-center px-2 py-1 text-sm text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap",
                { "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500": color === "primary" },
                { "bg-green-600 hover:bg-green-700 focus:ring-green-500": color === "secondary" },
                { "bg-red-600 hover:bg-red-700 focus:ring-red-500": color === "error" }
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {content}
        </button>
    );
};

const getButtonNoOnClick = (
    index: number,
    color: BtnColor,
    variant: BtnVariant,
    type: BtnType,
    disabled: boolean,
    content: JSX.Element
) => {
    if (variant === "text") {
        return (
            <button
                key={`b-${index}`}
                type={type}
                disabled={disabled}
                className={clsx(
                    "bg-transparent text-sm px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:text-gray-400 disabled:cursor-not-allowed whitespace-nowrap",
                    { "text-blue-600 hover:text-blue-800 focus:ring-blue-500": color === "primary" },
                    { "text-green-600 hover:text-green-700 focus:ring-green-500": color === "secondary" },
                    { "text-red-600 hover:text-red-700 focus:ring-red-500": color === "error" }
                )}
            >
                {content}
            </button>
        );
    }
    return (
        <button
            key={`b-${index}`}
            type={type}
            className={clsx(
                "px-2 py-1 text-sm text-white font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap",
                { "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500": variant === "contained" && color === "primary" },
                {
                    "bg-green-600 hover:bg-green-700 focus:ring-green-500":
                        variant === "contained" && color === "secondary",
                },
                { "bg-red-600 hover:bg-red-700 focus:ring-red-500": variant === "contained" && color === "error" }
            )}
            disabled={disabled}
        >
            {content}
        </button>
    );
};

const getIconButtonWithOnClick = (
    index: number,
    type: BtnType,
    onClick: (() => void) | undefined,
    content: JSX.Element
) => {
    return (
        <button
            key={`i-${index}`}
            className="px-3 py-1 border border-blue-500 text-blue-500 bg-transparent rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            type={type}
            onClick={onClick}
        >
            {content}
        </button>
    );
};

const getIconButtonNoOnClick = (index: number, type: BtnType, content: JSX.Element) => {
    return (
        <button
            key={`i-${index}`}
            className="px-3 py-1 border border-blue-500 text-blue-500 bg-transparent rounded-md hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            type={type}
        >
            {content}
        </button>
    );
};
