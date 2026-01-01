import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";

const InputField = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    autoComplete,
    startAdornment,
    validateErrorMessage,
    rules = {},
    disabled = false,
    required = false,
    type,
    endAdornment,
}: FormInputProps<TFormValues>): JSX.Element => {
    const { control } = useFormContext();

    return (
        <Controller
            render={({ field, fieldState }) => {
                const { ref, name, onChange, value, onBlur } = field;
                const { error } = fieldState;
                const errorMessages = error ? (validateErrorMessage ? validateErrorMessage : error.message) : undefined;
                const hasError = !!errorMessages;
                return (
                    <div className="relative">
                        {!startAdornment && (
                            <label
                                htmlFor={name}
                                className={clsx(
                                    "block text-sm font-medium",
                                    { "text-red-600": hasError },
                                    { "text-gray-700": !hasError }
                                )}
                            >
                                {label}
                            </label>
                        )}
                        <div className="mt-1 flex items-center">
                            {startAdornment && <span className="absolute left-3 text-gray-500">{label}</span>}
                            <input
                                {...field}
                                ref={ref}
                                type={type}
                                disabled={!!disabled}
                                required={!!required}
                                name={name}
                                onChange={onChange}
                                onBlur={onBlur}
                                value={value ?? ""}
                                aria-invalid={hasError}
                                className={clsx(
                                    "w-full pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    { "border-red-500 text-red-900 placeholder-red-300": hasError },
                                    { "border-gray-300 text-gray-900 placeholder-gray-500": !hasError },
                                    { "pl-3": !startAdornment },
                                    { "pl-10": startAdornment }
                                )}
                                aria-errormessage={errorMessages}
                                autoComplete={autoComplete}
                            />
                            {endAdornment && <span className="absolute right-3 text-gray-500">{endAdornment}</span>}
                        </div>
                        {hasError && errorMessages && <p className="mt-2 text-xs text-red-600">{errorMessages}</p>}
                    </div>
                );
            }}
            name={name}
            control={control}
            rules={rules}
        />
    );
};
export default InputField;
