import clsx from "clsx";
import { FC } from "react";

const ImageCellItem: FC<{
    locked: boolean;
    passive: boolean;
    src?: string;
    height?: number;
    width?: number;
    alt: string;
}> = ({ locked, passive, src, height, width, alt }) => {
    return (
        <div
            className={clsx(
                "userImage",
                { "text-red": locked },
                { "text-inherit": !locked },
                { "line-through": passive },
                { "no-underline": !passive }
            )}
        >
            {src ? <img src={src} height={height ?? 50} width={width ?? 50} alt={alt} /> : ""}
        </div>
    );
};
export default ImageCellItem;
