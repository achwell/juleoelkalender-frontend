import { FC, InputHTMLAttributes, useEffect, useRef, useState } from "react";

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
  const [draft, setDraft] = useState({ source: initialValue, value: initialValue });
  const value = draft.source === initialValue ? draft.value : initialValue;
  const pending = useRef<{ timer: ReturnType<typeof setTimeout>; source: string | number; delay: number } | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => () => clearTimeout(pending.current?.timer), []);
  useEffect(() => {
    if (pending.current && (pending.current.source !== initialValue || pending.current.delay !== debounce)) {
      clearTimeout(pending.current.timer);
      pending.current = null;
    }
  }, [initialValue, debounce]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => {
        const next = e.target.value;
        setDraft({ source: initialValue, value: next });
        clearTimeout(pending.current?.timer);
        pending.current = {
          source: initialValue,
          delay: debounce,
          timer: setTimeout(() => {
            pending.current = null;
            onChangeRef.current(next);
          }, debounce),
        };
      }}
    />
  );
};
export default DebouncedInput;
