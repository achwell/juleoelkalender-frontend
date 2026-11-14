import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Uptime from "../src/components/dashboard/Uptime";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("ticks from the server value, resets to zero after a restart and cleans up its timer", () => {
  vi.useFakeTimers();
  const { rerender, unmount } = render(<Uptime processUptime={10} />);
  expect(screen.getByText("pages.dashboard.uptime: 10 time.short.second")).toBeTruthy();
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByText("pages.dashboard.uptime: 11 time.short.second")).toBeTruthy();
  rerender(<Uptime processUptime={0} />);
  expect(screen.getByText("pages.dashboard.uptime:")).toBeTruthy();
  act(() => {
    vi.advanceTimersByTime(1000);
  });
  expect(screen.getByText("pages.dashboard.uptime: 1 time.short.second")).toBeTruthy();
  unmount();
  expect(vi.getTimerCount()).toBe(0);
});
