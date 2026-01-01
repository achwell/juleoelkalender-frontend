import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    show: boolean;
}

const ConditionalBlock: FC<Props> = ({ children, show }) => {
    return show ? <div className="pt-4">{children}</div> : null;
};
export default ConditionalBlock;
