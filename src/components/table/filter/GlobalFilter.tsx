import DebouncedInput from "@/components/table/filter/DebouncedInput";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    globalFilter: string;
    setGlobalFilter: (value: ((prevState: string) => string) | string) => void;
}

const GlobalFilter: FC<Props> = ({ globalFilter, setGlobalFilter }) => {
    const { t } = useTranslation();
    return (
        <DebouncedInput
            value={globalFilter}
            onChange={(value) => setGlobalFilter(String(value))}
            className="p-2 font-lg shadow border border-block"
            placeholder={t("table.search")}
        />
    );
};
export default GlobalFilter;
