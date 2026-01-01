import CircularProgress from "@/components/layout/CircularProgress";
import { FC, PropsWithChildren } from "react";

const FullScreenLoader: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="h-[95vh]">
            <div className="flex items-center justify-center h-full">
                <CircularProgress />
                {children}
            </div>
        </div>
    );
};

export default FullScreenLoader;
