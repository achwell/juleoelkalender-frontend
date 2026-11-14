import { describe, expect, it } from "vitest";
import { BASE_URL } from "../src/environment";
import type Exchange from "../src/types/dashboard/Exchange";
import { groupDevices, processExchanges } from "../src/utils/graphUtils";

const exchange = (path: string, status: number): Exchange => ({
  timestamp: new Date(),
  request: { uri: `${BASE_URL}/api/v1${path}`, remoteAddress: "localhost", method: "GET", headers: new Map() },
  response: { status, headers: new Map() },
  timeTaken: "PT0.1S",
});

describe("HTTP exchange aggregation", () => {
  it("counts repeated URIs across status codes and preserves first-seen URI order", () => {
    expect(
      processExchanges([
        exchange("/review", 500),
        exchange("/beer", 200),
        exchange("/review", 200),
        exchange("/review", 500),
        exchange("/beer", 404),
      ]),
    ).toEqual({
      uris: ["/review", "/beer"],
      statusCodes: [200, 404, 500],
      counts: { 200: [1, 1], 404: [0, 1], 500: [2, 0] },
    });
  });
  it("handles empty input", () => {
    expect(processExchanges([])).toEqual({ uris: [], statusCodes: [], counts: {} });
  });
});

describe("device aggregation", () => {
  it("counts categories, skips missing names and uses the current translated platform labels", () => {
    const devices = [
      { isMobile: true, browserName: "Firefox", osName: "Android" },
      { isMobile: false, browserName: "Chrome", osName: "Linux" },
      { isMobile: true, browserName: "Firefox", osName: "Android" },
      { isMobile: false },
    ];
    expect(groupDevices(devices, "Mobil", "Skrivebord")).toEqual({
      browserChartData: [
        { name: "Firefox", value: 2 },
        { name: "Chrome", value: 1 },
      ],
      mobileChartData: [
        { name: "Mobil", value: 2 },
        { name: "Skrivebord", value: 2 },
      ],
      osChartData: [
        { name: "Android", value: 2 },
        { name: "Linux", value: 1 },
      ],
    });
    expect(groupDevices(devices, "Mobile", "Desktop").mobileChartData[0].name).toBe("Mobile");
    expect(devices[0].browserName).toBe("Firefox");
  });
  it("handles empty input", () => {
    expect(groupDevices([], "Mobile", "Desktop")).toEqual({
      browserChartData: [],
      mobileChartData: [],
      osChartData: [],
    });
  });
});
