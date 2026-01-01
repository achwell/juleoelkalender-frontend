import SelectItem from "@/types/SelectItem";
import { HTMLInputAutoCompleteAttribute, JSX } from "react";
import { Path, RegisterOptions } from "react-hook-form";

type FormInputProps<TFormValues> = {
    name: Path<TFormValues>;
    label?: string;
    step?: "any" | number;
    min?: number;
    max?: number;
    rows?: number;
    type?:
        | "button"
        | "checkbox"
        | "color"
        | "date"
        | "datetime-local"
        | "email"
        | "file"
        | "hidden"
        | "image"
        | "month"
        | "number"
        | "password"
        | "radio"
        | "range"
        | "reset"
        | "search"
        | "submit"
        | "tel"
        | "text"
        | "time"
        | "url"
        | "week";
    autoComplete?: HTMLInputAutoCompleteAttribute | undefined;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    showPassword?: boolean;
    toggleShowPassword?: () => void;
    callback?: (value: string) => void;
    selectItems?: SelectItem[];
    startAdornment?: boolean;
    endAdornment?: JSX.Element;
    validateErrorMessage?: string;
    options?: string[];
    rules?: Exclude<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs">;
};
export default FormInputProps;
