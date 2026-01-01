import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const InputNumber = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    step = "any",
    min,
    max,
    disabled = false,
    startAdornment,
    validateErrorMessage,
    rules = {},
    required = false,
}: FormInputProps<TFormValues>): JSX.Element => {
    const { t } = useTranslation();
    const { control, setError, setValue } = useFormContext();

    return (
        <Controller
            render={({ field, fieldState }) => {
                const { ref, name, onChange, value, onBlur } = field;
                const { error } = fieldState;
                const errorMessages = error ? (validateErrorMessage ? validateErrorMessage : error.message) : undefined;

                const extraOnChange = (e: any) => {
                    const value = e.target.value;
                    const numValue = value ? +value : undefined;

                    if (required && numValue === undefined) {
                        setError(name, { message: t("validation.required", { field: label, number: min }) });
                    } else {
                        setError(name, { message: undefined });
                    }

                    if (numValue) {
                        if (min !== undefined) {
                            if (numValue < min) {
                                setError(name, { message: t("validation.minvalue", { field: label, number: min }) });
                            }
                        }
                        if (max !== undefined) {
                            if (numValue > max) {
                                setError(name, { message: t("validation.maxvalue", { field: label, number: max }) });
                            }
                        }
                    }
                    onChange(numValue);
                    setValue(name, value);
                };
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
                        <div className="mt-1 flex items-center">
                            {startAdornment && <span className="absolute left-3 text-gray-500">{label}</span>}
                            <input
                                {...field}
                                id={name}
                                name={name}
                                ref={ref}
                                type="number"
                                value={value}
                                onChange={extraOnChange}
                                onBlur={onBlur}
                                required={required}
                                disabled={disabled}
                                min={min}
                                max={max}
                                step={step}
                                inputMode="decimal"
                                autoComplete="off"
                                className={clsx(
                                    "w-full pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    { "pl-3": !startAdornment },
                                    { "pl-10": startAdornment },
                                    { "bg-white border-gray-300 text-gray-900 placeholder-gray-500": !disabled },
                                    { "bg-gray-100 cursor-not-allowed": disabled },
                                    { "border-red-500": errorMessages }
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
export default InputNumber;
