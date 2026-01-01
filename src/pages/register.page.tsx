import ActionKnapper from "@/components/ActionKnapper";
import InputEmail from "@/components/form/InputEmail";
import InputPassword from "@/components/form/InputPassword";
import InputText from "@/components/form/InputText";
import H1 from "@/components/layout/H1";
import LanguageSelector from "@/components/layout/LanguageSelector";
import Paragraph from "@/components/layout/Paragraph";
import { SUPPORT_EMAIL } from "@/environment";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import registerInputSchema from "@/schema/registerInputSchema";
import { ButtonType } from "@/types/ButtonProps";
import RegisterInput from "@/types/RegisterInput";
import { handleError } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const RegisterPage = () => {
    const { t } = useTranslation();

    const methods = useForm<RegisterInput>({
        mode: "onChange",
        resolver: zodResolver(registerInputSchema(t)),
        defaultValues: {
            firstName: "",
            middleName: "",
            lastName: "",
            confirmPassword: "",
            showPassword: false,
            email: "",
            password: "",
            area: "",
            calendarToken: "",
        },
    });

    const [registerUser, { isLoading, isSuccess, error, isError }] = useRegisterUserMutation();

    const navigate = useNavigate();

    const {
        handleSubmit,
        setValue,
        watch,
        formState: { isDirty, isSubmitSuccessful, isValid },
        reset,
    } = methods;

    const { showPassword } = watch();

    useEffect(() => {
        if (isSuccess) {
            toast.success(
                t("add.added", {
                    field: t("pages.register.user"),
                })
            );
            navigate("/login");
        }

        if (isError) {
            if (error) {
                handleError(t, error);
            }
        }
    }, [isLoading]);

    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful]);

    const onSubmit: SubmitHandler<RegisterInput> = async (values) => {
        return registerUser(values);
    };

    return (
        <main className="max-w-xs mx-auto px-4">
            <div className="flex flex-col justify-center items-start">
                <div className="flex flex-row justify-end items-end">
                    <LanguageSelector />
                </div>
                <H1>{t("pages.register.header")}</H1>
                <Paragraph>
                    {t("pages.register.subheader")}{" "}
                    <Link
                        to={`mailto:${SUPPORT_EMAIL}`}
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                    >
                        {SUPPORT_EMAIL}
                    </Link>
                </Paragraph>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off" className="mx-auto">
                        <div className="flex flex-col space-y-2">
                            <InputText name="calendarToken" label={t("pages.register.token")} required={true} />
                            <InputText name="firstName" label={t("pages.register.firstName")} required={true} />
                            <InputText name="middleName" label={t("pages.register.middleName")} />
                            <InputText name="lastName" label={t("pages.register.lastName")} required={true} />
                            <InputEmail
                                name="email"
                                label={t("pages.register.email")}
                                required={true}
                                autoComplete="new-password"
                            />
                            <InputPassword
                                name="password"
                                label={t("pages.register.passwordlabel")}
                                showPassword={showPassword}
                                autoComplete="new-password"
                                required={true}
                                toggleShowPassword={() => setValue("showPassword", !showPassword)}
                            />
                            <InputPassword
                                name="confirmPassword"
                                label={t("pages.register.confirmpasswordlabel")}
                                showPassword={showPassword}
                                required={true}
                                toggleShowPassword={() => setValue("showPassword", !showPassword)}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Paragraph>{t("pages.register.areacomment")}</Paragraph>
                            <InputText name="area" label={t("pages.register.area")} />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <ActionKnapper
                                buttons={[
                                    {
                                        icon: ButtonType.SUBMIT,
                                        text: isLoading
                                            ? t("pages.register.buttonregistering")
                                            : t("pages.register.buttonregister"),
                                        color: "primary",
                                        variant: "contained",
                                        onClick: () => {},
                                        disabled: isLoading || (!isDirty && !isValid),
                                    },
                                    {
                                        icon: ButtonType.LOGIN,
                                        text: t("pages.register.buttonlogin"),
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

export default RegisterPage;
