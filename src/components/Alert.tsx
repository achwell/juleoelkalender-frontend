import clsx from "clsx";
import { FC } from "react";

export type AlertColor = "success" | "warning" | "error";

interface Props {
    severity: AlertColor;
    text: string;
}

const Alert: FC<Props> = ({ severity, text }) => {
    const d =
        severity === "success"
            ? "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            : severity === "warning"
              ? "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              : "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z";

    return (
        <div
            role="alert"
            className={clsx(
                "flex items-center p-4 mb-4 border-l-4 rounded-md",
                { "bg-green-100 text-green-800 border-green-400": severity === "success" },
                { "bg-yellow-100 text-yellow-800 border-yellow-400": severity === "warning" },
                { "bg-red-100 text-red-800 border-red-400": severity === "error" }
            )}
        >
            <svg viewBox="0 0 24 24" fill="currentColor" data-slot="icon" aria-hidden="true" className="w-5 h-5 mr-3">
                <path d={d} clipRule="evenodd" fillRule="evenodd"></path>
            </svg>

            <span>{text}</span>
        </div>
    );
};
export default Alert;
