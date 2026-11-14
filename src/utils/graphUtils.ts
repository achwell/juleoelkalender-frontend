import type Device from "@/types/dashboard/Device";
import type ChartData from "@/types/dashboard/ChartData";
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
    new Set<string>(exs.map(({ request: { uri } }) => uri.replace(BASE_URL, "").replace("/api/v1", ""))),
  );
  const statusCodes = Array.from(new Set<number>(exs.map(({ response: { status } }) => status))).toSorted(
    (a, b) => a - b,
  );

  const counts: { [status: number]: number[] } = {};
  for (const status of statusCodes) {
    counts[status] = Array<number>(uris.length).fill(0);
  }

  const uriIndexes = new Map(uris.map((uri, index) => [uri, index]));

  exs.forEach(({ request: { uri }, response: { status } }) => {
    const url = uri.replace(BASE_URL, "").replace("/api/v1", "");
    const uriIndex = uriIndexes.get(url)!;
    counts[status][uriIndex] += 1;
  });

  return { uris, statusCodes, counts };
};

const increment = (counts: Map<string, number>, key: string | undefined) => {
  if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
};

const toChartData = (counts: Map<string, number>): ChartData[] =>
  Array.from(counts, ([name, value]) => ({ name, value }));

// Map insertion order preserves the order in which categories first appear.
export const groupDevices = (devices: Device[], mobileLabel: string, desktopLabel: string) => {
  const browsers = new Map<string, number>();
  const platforms = new Map<string, number>();
  const systems = new Map<string, number>();
  for (const device of devices) {
    increment(browsers, device.browserName);
    increment(platforms, device.isMobile ? mobileLabel : desktopLabel);
    increment(systems, device.osName);
  }
  return {
    browserChartData: toChartData(browsers),
    mobileChartData: toChartData(platforms),
    osChartData: toChartData(systems),
  };
};
