import { FC, type PropsWithChildren } from "react";

const Paragraph: FC<PropsWithChildren> = ({ children }) => <p className="mt-2 mb-2 text-gray-600">{children}</p>;
export default Paragraph;
