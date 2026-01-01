import TabPanel from "@/components/tabs/TabPanel";
import clsx from "clsx";
import { FC, PropsWithChildren, useState } from "react";

interface TabProps extends PropsWithChildren {
    label: string;
    hidden?: boolean;
}

interface Props {
    title: string;
    tabs: TabProps[];
}

const TabBox: FC<Props> = ({ title, tabs }) => {
    const [value, setValue] = useState(0);
    const handleChange = (newValue: number) => setValue(newValue);

    return (
        <div className="border-b border-gray-300">
            <div className="flex items-center space-x-4 px-3 rounded-t-lg">
                {tabs
                    .filter((tab) => !tab.hidden)
                    .map((tab, idx) => (
                        <button
                            key={`tab-${idx}`}
                            id={`simple-tab-${idx}`}
                            className={clsx(
                                "px-4 py-2 bg-blue-100 rounded-t-lg shadow-md hover:bg-blue-600",
                                { "border-b-2 bg-blue-500 border-blue-500 text-white": value === idx },
                                { "text-gray-600 hover:text-gray-700": value !== idx }
                            )}
                            onClick={() => handleChange(idx)}
                            aria-controls={`simple-tabpanel-${idx}`}
                            aria-label={title}
                        >
                            {tab.label}
                        </button>
                    ))}
            </div>
            <div className="p-4 bg-white rounded-b-lg shadow-md">
                {tabs
                    .filter((tab) => !tab.hidden)
                    .map((tab, idx) => (
                        <TabPanel key={`tab-panel-${idx}`} index={idx} value={value}>
                            {tab.children}
                        </TabPanel>
                    ))}
            </div>
        </div>
    );
};
export default TabBox;
