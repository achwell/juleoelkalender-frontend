import InputField from "@/components/form/InputField";
import FormInputProps from "@/types/FormInputProps";
import { validate } from "@shaqrivera/email-validator";
import { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const InputEmail = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    autoComplete,
    startAdornment,
    validateErrorMessage,
    rules = {},
    disabled = false,
    required = false,
    endAdornment,
}: FormInputProps<TFormValues>): JSX.Element => {
    const { t } = useTranslation();
    const {
        formState: { errors },
    } = useFormContext();

    const emailErrorMessage =
        errors[name] && errors[name]?.type === "validate" ? t("validation.email") : errors[name]?.message?.toString();

    const emailRules = { ...rules, validate };
    const errorMessages = emailErrorMessage
        ? emailErrorMessage
        : validateErrorMessage
          ? validateErrorMessage
          : undefined;

    return (
        <InputField
            name={name}
            label={label}
            type="email"
            autoComplete={autoComplete}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
            validateErrorMessage={errorMessages}
            rules={emailRules}
            disabled={disabled}
            required={required}
        />
    );
};
export default InputEmail;
