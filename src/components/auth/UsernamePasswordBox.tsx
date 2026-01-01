import ActionKnapper from "@/components/ActionKnapper";
import InputEmail from "@/components/form/InputEmail";
import InputPassword from "@/components/form/InputPassword";
import { ButtonType } from "@/types/ButtonProps";
import LoginInput from "@/types/LoginInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FC, useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface Props {
    loginUser: (loginInput: LoginInput) => void;
}

const UsernamePasswordBox: FC<Props> = ({ loginUser }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onSubmit: SubmitHandler<LoginInput> = (values) => loginUser(values);

    const loginSchema = z.object({
        email: z
            .email({
                error: t("validation.invalid", {
                    field: t("pages.login.email"),
                }),
            })
            .min(1, {
                error: t("validation.required", {
                    field: t("pages.login.email"),
                }),
            }),
        password: z
            .string()
            .min(1, {
                error: t("validation.required", {
                    field: t("pages.login.password"),
                }),
            })
            .min(8, {
                error: t("validation.mincharacters", {
                    field: t("pages.login.password"),
                    number: 8,
                }),
            })
            .max(32, {
                error: t("validation.maxcharacters", {
                    field: t("pages.login.password"),
                    number: 32,
                }),
            }),
        showPassword: z.boolean(),
    });

    const methods = useForm<LoginInput>({
        defaultValues: {
            email: "",
            password: "",
            showPassword: false,
        },
        mode: "onChange",
        resolver: zodResolver(loginSchema),
    });

    const {
        formState: { isSubmitSuccessful },
        handleSubmit,
        reset,
        setValue,
        watch,
    } = methods;
    const { showPassword } = watch();

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="flex flex-col space-y-2">
                    <InputEmail
                        name="email"
                        label={t("pages.login.email")}
                        required={true}
                        autoComplete="current-password"
                    />
                    <InputPassword
                        name="password"
                        label={t("pages.login.password")}
                        required={true}
                        autoComplete="current-password"
                        showPassword={showPassword}
                        toggleShowPassword={() => setValue("showPassword", !showPassword)}
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <ActionKnapper
                        buttons={[
                            {
                                icon: ButtonType.LOGIN,
                                text: t("pages.login.login"),
                                type: "submit",
                            },
                            {
                                icon: ButtonType.REGISTER,
                                text: t("pages.login.register"),
                                onClick: () => {
                                    navigate("/register", {
                                        replace: true,
                                        relative: "route",
                                    });
                                },
                            },
                            {
                                icon: ButtonType.PASSWORD,
                                text: t("pages.login.forgottenpassword"),
                                onClick: () => {
                                    navigate("/forgottenpassword", {
                                        replace: true,
                                        relative: "route",
                                    });
                                },
                            },
                        ]}
                    />
                </div>
            </form>
        </FormProvider>
    );
};

export default UsernamePasswordBox;
