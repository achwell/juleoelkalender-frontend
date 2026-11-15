/* oxlint-disable jsx-a11y/prefer-tag-over-role */
// The editable combobox uses custom listbox and option roles.
import FormInputProps from "@/types/FormInputProps";
import { clsx } from "clsx";
import { JSX, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";

const InputAutocomplete = <TFormValues extends Record<string, unknown>>({
  name: fieldName,
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
  const { control } = useFormContext();

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { field, fieldState } = useController({ name: fieldName, control, rules });
  const { ref, name, onChange, value, onBlur } = field;
  const { error } = fieldState;
  const errorMessages = error ? (validateErrorMessage ?? error.message) : undefined;
  const hasError = !!errorMessages;
  const errorId = `${name}-error`;
  const optionsId = `${name}-options`;

  const handleOptionClick = (option: string) => {
    onChange(option);
    callback?.(option);
    setOpen(false);
    onBlur();
  };

  const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(String(value ?? "").toLowerCase()));
  const selectedIndex = Math.min(activeIndex, filteredOptions.length - 1);
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || filteredOptions.length === 0) {
      if (event.key === "ArrowDown" && filteredOptions.length > 0) {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % filteredOptions.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + filteredOptions.length) % filteredOptions.length);
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          event.preventDefault();
          handleOptionClick(filteredOptions[selectedIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
    }
  };

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
              { "text-gray-700": !hasError },
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
          disabled={disabled}
          required={required}
          name={name}
          id={name}
          onChange={(event) => {
            onChange(event);
            setActiveIndex(0);
          }}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
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
            { "bg-gray-100 cursor-not-allowed": disabled },
          )}
          aria-invalid={hasError}
          aria-errormessage={hasError ? errorId : undefined}
          aria-describedby={hasError ? errorId : undefined}
          aria-autocomplete="list"
          aria-expanded={open && filteredOptions.length > 0}
          aria-controls={open && filteredOptions.length > 0 ? optionsId : undefined}
          aria-activedescendant={open && selectedIndex >= 0 ? `${optionsId}-${selectedIndex}` : undefined}
          role="combobox"
          autoComplete="off"
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">{endAdornment}</div>
        )}
      </div>
      {open && filteredOptions.length > 0 && (
        <div
          id={optionsId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-200 shadow-lg"
        >
          {filteredOptions.map((opt, index) => (
            <div
              key={opt}
              id={`${optionsId}-${index}`}
              role="option"
              aria-selected={selectedIndex === index}
              onPointerDown={(event) => {
                event.preventDefault();
                handleOptionClick(opt);
              }}
              className={clsx("cursor-pointer px-4 py-2", {
                "bg-indigo-100": selectedIndex === index,
              })}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
      {hasError && errorMessages && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {errorMessages}
        </p>
      )}
    </div>
  );
};
export default InputAutocomplete;
