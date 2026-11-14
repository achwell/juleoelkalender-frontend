import FormInputProps from "@/types/FormInputProps";
import { clsx } from "clsx";
import { JSX } from "react";
import { Controller, useFormContext } from "react-hook-form";

const InputSelect = <TFormValues extends Record<string, unknown>>({
  name,
  label,
  selectItems,
  validateErrorMessage,
  rules = {},
  callback,
  disabled = false,
  required = false,
}: FormInputProps<TFormValues>): JSX.Element => {
  const { control } = useFormContext();

  return (
    <>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const { name: nameValue, onChange } = field;
          const { error } = fieldState;
          const errorMessages = error ? (validateErrorMessage ?? error.message) : undefined;
          const hasError = !!errorMessages;
          return (
            <>
              <select
                id={nameValue}
                disabled={disabled}
                required={required}
                {...field}
                aria-invalid={hasError}
                onChange={(event) => {
                  callback?.(event.target.value);
                  onChange(event);
                }}
                className={clsx(
                  "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
                  { invalid: hasError },
                )}
                aria-errormessage={errorMessages}
              >
                {(selectItems ?? []).map((selectItemsValue) => (
                  <option key={selectItemsValue.key} value={selectItemsValue.key}>
                    {selectItemsValue.value}
                  </option>
                ))}
              </select>
              {hasError && <p className="mt-2 text-sm text-red-600">{errorMessages}</p>}
            </>
          );
        }}
      />
    </>
  );
};
export default InputSelect;
