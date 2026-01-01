import InputField from "@/components/form/InputField";
import FormInputProps from "@/types/FormInputProps";
import { JSX } from "react";

const InputText = <TFormValues extends Record<string, unknown>>({
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
    return (
        <InputField
            name={name}
            label={label}
            type="text"
            autoComplete={autoComplete}
            startAdornment={startAdornment}
            endAdornment={endAdornment}
            validateErrorMessage={validateErrorMessage}
            rules={rules}
            disabled={disabled}
            required={required}
        />
    );
};
export default InputText;
