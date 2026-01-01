import ActionKnapper from "@/components/ActionKnapper";
import InputEmail from "@/components/form/InputEmail";
import InputText from "@/components/form/InputText";
import H1 from "@/components/layout/H1";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useAddTokenMutation } from "@/redux/api/authApi";
import addTokenSchema from "@/schema/addTokenSchema";
import { ButtonType } from "@/types/ButtonProps";
import { handleError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

interface Props {
    email: string;
    token: string;
}

const AddTokenPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const [addToken, { isLoading, isSuccess, isError, error }] = useAddTokenMutation();

    const methods = useForm<Props>({
        defaultValues: {
            email: email ?? "",
            token: "",
        },
        mode: "onChange",
        resolver: zodResolver(addTokenSchema(t)),
    });

    const {
        handleSubmit,
        formState: { isDirty, isValid },
    } = methods;

    useEffect(() => {
        if (!isLoading) {
            if (isSuccess) {
                navigate("/login");
            } else if (isError && error) {
                handleError(t, error);
            }
        }
    }, [isLoading]);

    const onSubmit = async ({ email, token }: Props) => {
        if (!isLoading) {
            addToken({ email, token });
        }
    };

    return (
        <main className="max-w-xs mx-auto px-4">
            <div className="flex flex-col justify-center items-start">
                <div className="flex flex-row justify-end items-end">
                    <LanguageSelector />
                </div>
                <H1>{t("pages.addtoken.header")}</H1>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" className="w-[50vw] mx-auto">
                        <div className="flex flex-col space-y-2">
                            <InputEmail
                                name="email"
                                label={t("pages.addtoken.email")}
                                required={true}
                                disabled={!!email}
                            />
                            <InputText name="token" label={t("pages.addtoken.token")} required={true} />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <ActionKnapper
                                buttons={[
                                    {
                                        icon: ButtonType.SUBMIT,
                                        text: t("pages.addtoken.addtoken"),
                                        type: "submit",
                                        variant: "contained",
                                        disabled: isLoading || (!isDirty && !isValid),
                                        onClick: () => {},
                                    },
                                    {
                                        icon: ButtonType.LOGIN,
                                        text: t("pages.addtoken.hasuserlogin"),
                                        color: "secondary",
                                        type: "button",
                                        onClick: () => navigate("/login"),
                                    },
                                ]}
                            />
                        </div>
                    </form>
                </FormProvider>
            </div>
        </main>
    );
};
export default AddTokenPage;
