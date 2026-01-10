import { HealthStatus } from "@/redux/features/dashboardSlice";
import ErrorMessage from "@/types/ErrorMessage";
import { Review, RoleName, User } from "@/types/generated";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import type { SerializedError } from "@reduxjs/toolkit";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const isUserAdmin = (user: User | undefined | null) => {
    if (!user) {
        return false;
    }
    return user.role.name === RoleName.ROLE_ADMIN || user.role.name === RoleName.ROLE_MASTER;
};

export const isUserSystemAdmin = (user: User | undefined | null) => {
    if (!user) {
        return false;
    }
    return user.role.name === RoleName.ROLE_MASTER;
};

export const hasAuthority = (user: User | null | undefined, authority: string) => {
    if (!user) return false;
    return !!user.role.authorities.filter((a) => a.name === authority).at(0);
};

export const getRoleDescription = (t: (key: string) => string, role: string) => {
    switch (role) {
        case RoleName.ROLE_USER:
            return t("role.user");
        case RoleName.ROLE_ADMIN:
            return t("role.admin");
        case RoleName.ROLE_MASTER:
            return t("role.master");
        default:
            return "";
    }
};
export const refreshData = () => {
    window.location.reload();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleArrayError = (
    t: (key: string) => string,
    data:
        | any[]
        | (any[] & {
              error: unknown;
          })
) => {
    if ("error" in data && Array.isArray(data.error)) {
        data.error.forEach((el) => {
            if ("message" in el) {
                const message = el.message;
                if (message === t("pages.login.invalidTokenReceived")) return true;
                return toast(message, {
                    position: "top-right",
                    type: "error",
                });
            }
        });
    }
};

export const handleError = (t: (key: string) => string, error: FetchBaseQueryError | SerializedError) => {
    if ("data" in error) {
        const data = error.data;
        if (Array.isArray(data)) {
            handleArrayError(t, data);
        } else if (data instanceof String) {
            return toast(data as string, {
                position: "top-right",
                type: "error",
            });
        }
    }
    return false;
};

export const errorHandeling = (t: (key: string) => string, error: FetchBaseQueryError | SerializedError) => {
    if ("data" in error && "status" in error) {
        const { data, status } = error;
        if (status === 401) {
            const message = (data as ErrorMessage).data;
            toast.error(message, {
                position: "top-right",
            });
        } else {
            toast.error(data as string, {
                position: "top-right",
            });
            handleError(t, error);
        }
    } else {
        toast.error(t("pages.login.unknownerror"), {
            position: "top-right",
        });
        handleError(t, error);
    }
};

export const findFirstAvailableDay = (occupiedDays: number[]) => {
    const days = Array.from({ length: 24 }, (_, i) => i + 1);
    let i = 0;
    while (i < days.length) {
        const day = days[i];
        if (!occupiedDays.includes(day)) return day;
        i++;
    }
    return 1;
};

export const calculateAverage = (reviews: Partial<Review>[]) => {
    const average: Partial<Review> = {
        ratingFeel: 0,
        ratingLabel: 0,
        ratingLooks: 0,
        ratingOverall: 0,
        ratingSmell: 0,
        ratingTaste: 0,
    };
    if (reviews.length === 0) {
        return average;
    }

    const addValue = (value1: number | undefined, value2: number | undefined) => {
        return (value1 ?? 0) + (value2 ?? 0);
    };

    reviews.forEach((review) => {
        average.ratingFeel = addValue(average.ratingFeel, review.ratingFeel);
        average.ratingLabel = addValue(average.ratingLabel, review.ratingLabel);
        average.ratingLooks = addValue(average.ratingLooks, review.ratingLooks);
        average.ratingOverall = addValue(average.ratingOverall, review.ratingOverall);
        average.ratingSmell = addValue(average.ratingSmell, review.ratingSmell);
        average.ratingTaste = addValue(average.ratingTaste, review.ratingTaste);
    });
    const length = reviews.length;
    average.ratingFeel = (average.ratingFeel || 0) / length;
    average.ratingLabel = (average.ratingLabel ?? 0) / length;
    average.ratingLooks = (average.ratingLooks ?? 0) / length;
    average.ratingOverall = (average.ratingOverall ?? 0) / length;
    average.ratingSmell = (average.ratingSmell ?? 0) / length;
    average.ratingTaste = (average.ratingTaste ?? 0) / length;
    return average;
};

export const secondsToDhms = (t: (key: string) => string, seconds: number) => {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const dDisplay = d > 0 ? `${d} ${t("time.short.day")}, ` : "";
    const hDisplay = h > 0 ? `${h} ${t("time.short.hour")}, ` : "";
    const mDisplay = m > 0 ? `${m} ${t("time.short.minute")}, ` : "";
    const sDisplay = s > 0 ? `${s} ${t("time.short.second")}` : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const downloadBinaryData = (result: any, fileName: string) => {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const hiddenElement = document.createElement("a");
    const url = window.URL || window.webkitURL;
    hiddenElement.href = url.createObjectURL(result.data as Blob);
    hiddenElement.target = "_blank";
    hiddenElement.download = fileName;
    hiddenElement.click();
    return { data: null };
};

export const translateStatus = (t: (key: string) => string, status: HealthStatus) => {
    switch (status) {
        case "DOWN":
            return t("status.down");
        case "UP":
            return t("status.up");
        case "OUT_OF_SERVICE":
            return t("status.outofservice");
        case "UNKNOWN":
            return t("status.unknown");
    }
};

export const getNameOfUser = (user?: User): string => {
    if (!user) return "";
    let name = user.firstName ?? "";
    if (user.middleName) {
        name += " " + user.middleName;
    }
    if (user.lastName) {
        name += " " + user.lastName;
    }
    return name;
};
export const formateRatingvalue = (value: number | null | undefined): string => {
    if (!value) return "";
    return value.toFixed(1);
};

export const getUserFromGoogleLogin = (credential: string) => {
    return jwtDecode<{
        alg: "RS256";
        email: string;
        family_name: string;
        given_name: string;
        picture: string | undefined;
    }>(credential, { header: false });
};
