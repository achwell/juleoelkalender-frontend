import H2 from "@/components/layout/H2";
import { FC, PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
    show: boolean;
    hide: () => void;
    title?: string;
}

const ModalDialog: FC<Props> = ({ show, hide, title, children }) => {
    return (
        show && (
            <div id="modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl" onClick={hide}>
                        ×
                    </button>
                    {title && <H2>{title}</H2>}
                    {children}
                </div>
            </div>
        )
    );
};

export default ModalDialog;
