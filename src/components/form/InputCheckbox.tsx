import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";

const InputCheckbox = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    validateErrorMessage,
    rules = {},
    disabled = false,
}: FormInputProps<TFormValues>): JSX.Element => {
    const { control } = useFormContext();

    return (
        <Controller
            render={({ field, fieldState }) => {
                const { ref, onChange, value } = field;

                const { error } = fieldState;
                const errorMessages = error ? (validateErrorMessage ?? error.message) : undefined;
                const hasError = !!errorMessages;
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            {...field}
                            ref={ref}
                            type="checkbox"
                            id={name}
                            name={name}
                            checked={!!value}
                            onChange={onChange}
                            disabled={disabled}
                            className={clsx(
                                "h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500",
                                { invalid: hasError },
                                { "cursor-not-allowed opacity-50": disabled }
                            )}
                        />
                        <label
                            htmlFor={name}
                            className={clsx(
                                "text-sm font-medium text-gray-700",
                                { invalid: hasError },
                                { "text-gray-500": disabled }
                            )}
                        >
                            {label}
                        </label>
                        {errorMessages && <span className="text-xs text-red-600">{errorMessages}</span>}
                    </div>
                );
            }}
            name={name}
            control={control}
            rules={rules}
        />
    );
};
export default InputCheckbox;
