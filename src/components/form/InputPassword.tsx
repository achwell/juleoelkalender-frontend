import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const InputPassword = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    autoComplete,
    showPassword,
    toggleShowPassword,
    startAdornment,
    validateErrorMessage,
    rules = {},
    disabled = false,
    required = false,
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
                                    { "text-gray-400": disabled },
                                    { "text-gray-700": !disabled },
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
                                id={name}
                                name={name}
                                type={showPassword ? "text" : "password"}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                required={required}
                                disabled={disabled}
                                autoComplete={autoComplete}
                                className={clsx(
                                    "w-full pr-10 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    { "pl-3": !startAdornment },
                                    { "pl-10": startAdornment },
                                    { "bg-gray-100 cursor-not-allowed": disabled },
                                    { "bg-white border-gray-300 text-gray-900 placeholder-gray-500": !disabled },
                                    { "border-red-500": !errorMessages }
                                )}
                            />
                            <button
                                type="button"
                                onClick={toggleShowPassword}
                                className="absolute inset-y-0 top-5 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-500 focus:outline-none"
                                aria-label="toggle password visibility"
                            >
                                {showPassword ? (
                                    <MdVisibility className="h-5 w-5" />
                                ) : (
                                    <MdVisibilityOff className="h-5 w-5" />
                                )}
                            </button>
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
export default InputPassword;
