import { FC, InputHTMLAttributes, useEffect, useState } from "react";

interface Props {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}

const DebouncedInput: FC<Props & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">> = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value]);

    return <input {...props} value={value} onChange={(e) => setValue(e.target.value)} />;
};
export default DebouncedInput;
