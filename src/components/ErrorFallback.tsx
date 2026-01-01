import ActionKnapper from "@/components/ActionKnapper";
import H1 from "@/components/layout/H1";
import Paragraph from "@/components/layout/Paragraph";
import { ButtonType } from "@/types/ButtonProps";
import { FC } from "react";

interface Props {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: FC<Props> = ({ error, resetErrorBoundary }) => {
    return (
        <>
            <H1>Oops, det skjedde en feil!</H1>
            <div role="alert" className="w-full">
                <Paragraph>Det skjedde en feil:</Paragraph>
                <pre>{error.message}</pre>
                <ActionKnapper
                    buttons={[
                        {
                            text: "Prøv igjen",
                            icon: ButtonType.VIEW,
                            onClick: resetErrorBoundary,
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default ErrorFallback;
