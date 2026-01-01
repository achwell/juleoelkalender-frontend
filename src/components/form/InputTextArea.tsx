import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";

const InputTextArea = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    startAdornment,
    validateErrorMessage,
    disabled = false,
    required = false,
    rows,
    maxLength,
    rules = {},
}: FormInputProps<TFormValues>): JSX.Element => {
    const { control } = useFormContext();
    return (
        <Controller
            render={({ field, fieldState }) => {
                const { ref, name, onChange, value, onBlur } = field;
                const { error } = fieldState;
                const errorMessages = error ? (validateErrorMessage ? validateErrorMessage : error.message) : undefined;
                return (
                    <div className="relative">
                        {!startAdornment && (
                            <label
                                htmlFor={name}
                                className={clsx(
                                    "block text-sm font-medium",
                                    { "text-gray-400": disabled },
                                    { "text-gray-700": !disabled }
                                )}
                            >
                                {label}
                            </label>
                        )}
                        <div className="mt-1 relative">
                            {startAdornment && (
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    {label}
                                </span>
                            )}
                            <textarea
                                {...field}
                                ref={ref}
                                rows={rows ? rows : 5}
                                id={name}
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                required={required}
                                disabled={disabled}
                                maxLength={maxLength}
                                className={clsx(
                                    "w-full pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    { "bg-white border-gray-300 text-gray-900 placeholder-gray-500": !disabled },
                                    { "bg-gray-100 cursor-not-allowed": disabled },
                                    { "border-red-500": errorMessages },
                                    { "pl-10": startAdornment },
                                    { "pl-3": !startAdornment }
                                )}
                            />
                        </div>
                        {errorMessages && <p className="mt-2 text-xs text-red-600">{errorMessages}</p>}
                    </div>
                );
            }}
            name={name}
            control={control}
            rules={rules}
        />
    );
};
export default InputTextArea;
