import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    onClick: () => void;
    disabled: boolean;
    small?: boolean;
}
const PaginationButton: FC<Props> = ({ onClick, disabled, small = false, children }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                "relative inline-flex py-2 items-center border bg-white border-gray-300 text-sm font-medium hover:bg-gray-50",
                { "px-4 rounded-md text-gray-700": small },
                { "px-2 rounded-l-md text-gray-500": !small }
            )}
        >
            {children}
        </button>
    );
};
export default PaginationButton;
