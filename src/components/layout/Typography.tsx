import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "body1" | "body2" | "caption" | "paragraph";
    color?: string;
    className?: string;
}

const Typography: FC<Props> = ({ variant = "body1", color = "text-black", className, children }) => {
    const variants: Record<string, string> = {
        h1: "text-4xl font-bold",
        h2: "text-3xl font-semibold",
        h3: "text-2xl font-medium",
        h4: "text-xl font-normal",
        h5: "text-lg font-normal",
        h6: "text-base font-normal",
        body1: "text-base",
        body2: "text-sm",
        caption: "text-xs italic",
        paragraph: "text-base leading-relaxed",
    };

    const classNames = `${variants[variant]} ${color} ${className}`;

    return <div className={classNames}>{children}</div>;
};

export default Typography;
