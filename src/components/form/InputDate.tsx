import i18n from "@/i18n";
import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { parseISO } from "date-fns";
import { format } from "date-fns-tz";
import { enUS } from "date-fns/locale/en-US";
import { nb } from "date-fns/locale/nb";
import { JSX, useState } from "react";
import { DayPicker } from "react-day-picker";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const InputDate = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    disabled = false,
    startAdornment = false,
    rules = {},
}: FormInputProps<TFormValues>): JSX.Element => {
    const { language } = i18n;
    const { t } = useTranslation();
    const { control, watch } = useFormContext();

    const data = watch();

    const [isOpen, setIsOpen] = useState(false);

    const defaultValue = data[name];
    const locale = language === "en" ? enUS : nb;
    const dateFormat = t("common.dateformat");

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field, fieldState }) => {
                const { onChange, value } = field;
                const { error } = fieldState;
                const errorMessages = error ? error.message : undefined;
                const hasError = !!errorMessages;
                const val = typeof value === "string" ? parseISO(value) : value;

                return (
                    <div className="mt-1 relative">
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
                                type="text"
                                readOnly
                                value={value ? format(value, dateFormat, { locale }) : ""}
                                onClick={() => setIsOpen((prev) => !prev)}
                                className={clsx(
                                    "w-full cursor-pointer px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    { "border-gray-300 text-gray-900 placeholder-gray-500": !hasError },
                                    { "border-red-500 text-red-900 placeholder-red-300": hasError }
                                )}
                                aria-invalid={hasError}
                                aria-errormessage={errorMessages}
                            />
                            {isOpen && (
                                <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                                    <DayPicker
                                        locale={locale}
                                        selected={val}
                                        onSelect={onChange}
                                        showOutsideDays
                                        mode="single"
                                        onDayClick={() => setIsOpen((prev) => !prev)}
                                    />
                                </div>
                            )}
                        </div>
                        {errorMessages && <p className="mt-2 text-xs text-red-600">{errorMessages}</p>}
                    </div>
                );
            }}
        />
    );
};
export default InputDate;
