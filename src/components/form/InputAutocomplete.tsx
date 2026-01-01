import FormInputProps from "@/types/FormInputProps";
import clsx from "clsx";
import { JSX, useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const InputAutocomplete = <TFormValues extends Record<string, unknown>>({
    name,
    label,
    startAdornment = false,
    validateErrorMessage,
    callback,
    rules = {},
    type = "text",
    disabled = false,
    required = false,
    endAdornment,
    options = [],
}: FormInputProps<TFormValues>): JSX.Element => {
    const { control, setValue } = useFormContext();

    const [open, setOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <Controller
            render={({ field, fieldState }) => {
                const { ref, name, onChange, value, onBlur } = field;
                const { error } = fieldState;
                const errorMessages = error ? (validateErrorMessage ?? error.message) : undefined;
                const hasError = !!errorMessages;

                const handleOptionClick = (option: string) => {
                    // @ts-ignore
                    setValue(name, option);
                    onChange(option);
                    setOpen(false);
                    onBlur();
                };

                useEffect(() => {
                    if (value === "") {
                        setFilteredOptions(options);
                    } else {
                        setFilteredOptions(
                            options.filter((opt) => opt.toLowerCase().includes((value as string).toLowerCase()))
                        );
                    }
                }, [value, options]);

                useEffect(() => {
                    const handleClickOutside = (e: MouseEvent) => {
                        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                            setOpen(false);
                            onBlur();
                        }
                    };
                    document.addEventListener("mousedown", handleClickOutside);
                    return () => document.removeEventListener("mousedown", handleClickOutside);
                }, [onBlur]);

                return (
                    <div ref={containerRef} className="relative w-full max-w-md">
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
                            {startAdornment && (
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                    {label}
                                </span>
                            )}
                            <input
                                {...field}
                                ref={ref}
                                type={type}
                                disabled={!!disabled}
                                required={!!required}
                                name={name}
                                onChange={onChange}
                                onFocus={() => setOpen(true)}
                                onBlur={(e) => {
                                    if (callback) {
                                        callback(e.target.value);
                                    }
                                    onBlur();
                                }}
                                value={value ?? ""}
                                className={clsx(
                                    "w-full rounded-md border px-3 py-2 pr-10 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                                    { "border-gray-300": !hasError },
                                    { "border-red-500": hasError },
                                    { "pl-3": !startAdornment },
                                    { "pl-10": startAdornment },
                                    { "bg-white": !disabled },
                                    { "bg-gray-100 cursor-not-allowed": disabled }
                                )}
                                aria-invalid={hasError}
                                aria-errormessage={errorMessages}
                                autoComplete="true"
                            />
                            {endAdornment && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    {endAdornment}
                                </div>
                            )}
                        </div>
                        {open && filteredOptions.length > 0 && (
                            <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-200 shadow-lg">
                                {filteredOptions.map((opt) => (
                                    <li
                                        key={opt}
                                        onClick={() => handleOptionClick(opt)}
                                        className="cursor-pointer px-4 py-2 hover:bg-indigo-100"
                                    >
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {hasError && errorMessages && <p className="mt-2 text-sm text-red-600">{errorMessages}</p>}
                    </div>
                );
            }}
            name={name}
            control={control}
            rules={rules}
        />
    );
};
export default InputAutocomplete;
