import ActionKnapper from "@/components/ActionKnapper";
import InputEmail from "@/components/form/InputEmail";
import { useUserExistQuery } from "@/redux/api/authApi";
import { useAddPasswordChangeRequestMutation } from "@/redux/api/passwordChangeRequestApi";
import requestPasswordSchema from "@/schema/requestPasswordSchema";
import { ButtonType } from "@/types/ButtonProps";
import { handleError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Props {
    email: string;
    token: string;
}

const RequestForm: FC<{ callback: () => void }> = ({ callback }) => {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const methods = useForm<Props>({
        defaultValues: {
            email: "",
            token: uuidv4(),
        },
        mode: "onChange",
        resolver: zodResolver(requestPasswordSchema(t)),
    });
    const {
        handleSubmit,
        formState: { isDirty, isValid },
        watch,
    } = methods;
    const { email } = watch();
    const [addPasswordChangeRequest, { isLoading, isSuccess, data: passwordChangeRequest, isError, error }] =
        useAddPasswordChangeRequestMutation();
    const { data: userExist, isFetching: isFetchingUserExist } = useUserExistQuery(email, { skip: !email });

    const handleOk = async () => {
        callback();
    };

    useEffect(() => {
        if (!isLoading) {
            if (isSuccess && passwordChangeRequest) {
                handleOk();
            } else if (isError && error) {
                handleError(t, error);
            }
        }
    }, [isLoading]);

    const onSubmit = async ({ email, token }: Props) => {
        if (!isFetchingUserExist) {
            if (userExist) {
                addPasswordChangeRequest({ email, token });
            } else {
                toast.error(t("pages.forgottenpassword.usernotregistered"));
            }
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="flex flex-col space-y-2">
                    <InputEmail name="email" label={t("pages.forgottenpassword.email")} required={true} />
                </div>
                <div className="flex flex-col space-y-2">
                    <ActionKnapper
                        buttons={[
                            {
                                icon: ButtonType.PASSWORD,
                                text: t("pages.forgottenpassword.forgottenpassword"),
                                type: "submit",
                                variant: "contained",
                                disabled: isLoading || (!isDirty && !isValid),
                                onClick: () => {},
                            },
                            {
                                icon: ButtonType.LOGIN,
                                text: t("pages.forgottenpassword.hasuserlogin"),
                                color: "secondary",
                                type: "button",
                                onClick: () => navigate("/login"),
                            },
                        ]}
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default RequestForm;
