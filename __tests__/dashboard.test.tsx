import { cleanup, render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { afterEach, expect, it, vi } from "vitest";
import Dashboard from "../src/pages/admin/admin.dashboard.page";
import type DashboardData from "../src/types/dashboard/DashboardData";

const state = vi.hoisted(() => ({ data: undefined as DashboardData | undefined }));
vi.mock("../src/redux/api/dashboardApi", () => ({ useGetDashboardDataQuery: () => ({ data: state.data }) }));
vi.mock("../src/redux/api/actuatorApi", () => ({ useHttpexchangesQuery: () => ({ data: { exchanges: [] } }) }));
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock("../src/components/dashboard/Chart", () => ({ default: () => null }));
vi.mock("../src/components/dashboard/HttpExchanges", () => ({ default: () => null }));
afterEach(cleanup);

it("renders updated API measurements, including transitions to zero without a dashboard Redux store", async () => {
  state.data = {
    backendVersion: "1",
    backendBuildTime: null,
    cpuLoad: 2,
    freeDiskSpace: 5,
    diskUsage: 30,
    freeMemory: 3,
    processUptime: 100,
    devices: [],
    backendStatus: "UP",
    dbStatus: "UP",
    emailStatus: "UP",
    numberOfUsers: 10,
    newestUser: null,
    numberOfActiveUsers: 8,
    newestActiveUser: null,
    numberOfBeers: 9,
    numberOfBeersToPlace: 4,
    numberOfVacantCalendarDays: 12,
    newestBeer: null,
  };
  const { rerender } = render(
    <Suspense fallback="Loading">
      <Dashboard />
    </Suspense>,
  );
  expect(await screen.findByText("pages.dashboard.cpuload: 2.00%", {}, { timeout: 10000 })).toBeTruthy();
  expect(await screen.findByText("pages.dashboard.beers.unplaced: 4")).toBeTruthy();
  state.data = {
    ...state.data,
    cpuLoad: 0,
    freeMemory: 0,
    freeDiskSpace: 0,
    diskUsage: 0,
    numberOfBeers: 0,
    numberOfActiveUsers: 0,
    numberOfBeersToPlace: 0,
    numberOfVacantCalendarDays: 0,
  };
  rerender(
    <Suspense fallback="Loading">
      <Dashboard />
    </Suspense>,
  );
  expect(await screen.findByText("pages.dashboard.cpuload: 0.00%")).toBeTruthy();
  expect(screen.getByText("pages.dashboard.freememory: 0.00GB")).toBeTruthy();
  expect(screen.getByText("pages.dashboard.beers.unplaced: 0")).toBeTruthy();
  expect(screen.getByText("pages.dashboard.users.activecount: 0")).toBeTruthy();
}, 15000);
