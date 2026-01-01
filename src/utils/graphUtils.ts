import { BASE_URL } from "@/environment";
import Exchange from "@/types/dashboard/Exchange";

export const getBackgroundColor = (statusCode: number) => {
    switch (statusCode) {
        case 200:
            return "rgb(40,167,69)";
        case 400:
            return "rgb(253,126,20)";
        case 401:
            return "rgb(206, 20, 253)";
        case 403:
            return "rgb(108, 32, 128)";
        case 404:
            return "rgb(0,123,255)";
        case 500:
            return "rgb(220,53,69)";
        default:
            return "rgb(77, 250, 118)";
    }
};

export interface ProcessedData {
    uris: string[];
    statusCodes: number[];
    counts: {
        [status: number]: number[]; // for each status, an array aligned with `uris`
    };
}

export const processExchanges = (exs: Exchange[]): ProcessedData => {
    if (exs.length === 0) {
        return { counts: {}, statusCodes: [], uris: [] };
    }
    const uris = Array.from(
        new Set<string>(exs.map(({ request: { uri } }) => uri.replace(BASE_URL as string, "").replace("/api/v1", "")))
    );
    const statusCodes = Array.from(new Set<number>(exs.map(({ response: { status } }) => status))).sort(
        (a, b) => a - b
    );

    const counts: { [status: number]: number[] } = {};
    for (const status of statusCodes) {
        counts[status] = uris.map((_) => 0);
    }

    exs.forEach(({ request: { uri }, response: { status } }) => {
        const url = uri.replace(BASE_URL as string, "").replace("/api/v1", "");
        const uriIndex = uris.indexOf(url);
        counts[status][uriIndex] += 1;
    });

    return { uris, statusCodes, counts };
};
