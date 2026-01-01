import { User } from "@/types/generated";

export default interface Device {
    id?: string;
    mobileVendor?: string;
    mobileModel?: string;
    isMobile: boolean;
    osName?: string;
    osVersion?: string;
    browserName?: string;
    browserVersion?: string;
    user?: User;
}
