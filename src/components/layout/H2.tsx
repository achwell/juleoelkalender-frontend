import { FC, type PropsWithChildren } from "react";

const H2: FC<PropsWithChildren> = ({ children }) => (
    <h2 className="text-sm sm:text-sm md:text-xl lg:text-3xl xl:text-3xl mb-4">{children}</h2>
);
export default H2;
