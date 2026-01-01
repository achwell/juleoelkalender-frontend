import clsx from "clsx";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { FC } from "react";

const DateCellItem: FC<{
    locked: boolean;
    passive: boolean;
    value: string | Date | undefined;
    dateformat: string;
}> = ({ locked, passive, value, dateformat = "" }) => {
    const val = typeof value === "string" ? parseISO(value) : value;
    return (
        <div
            className={clsx(
                { "text-red": locked },
                { "text-inherit": !locked },
                { "line-through": passive },
                { "no-underline": !passive }
            )}
        >
            {val ? format(val, dateformat) : ""}
        </div>
    );
};
export default DateCellItem;
