import clsx from "clsx";
import { FC, JSX } from "react";

const CellItem: FC<{
    locked?: boolean;
    passive?: boolean;
    value: string | number | JSX.Element | undefined;
}> = ({ locked = false, passive = false, value = "" }) => (
    <div
        className={clsx(
            { "text-red": locked },
            { "text-inherit": !locked },
            { "line-through": passive },
            { "no-underline": !passive }
        )}
    >
        {value}
    </div>
);
export default CellItem;
