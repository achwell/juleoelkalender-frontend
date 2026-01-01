import { FC, type PropsWithChildren } from "react";

const H1: FC<PropsWithChildren> = ({ children }) => (
    <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-5xl mb-4">{children}</h1>
);
export default H1;
