import { act, cleanup, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { lazy } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import Layout from "../src/components/layout/layout";
import { baseApi } from "../src/redux/api/baseApi";
import authReducer, { setCurrentUser, setToken } from "../src/redux/features/authSlice";
import type { User } from "../src/types/generated";

const device = vi.hoisted(() => ({ isMobile: false }));
vi.mock("react-device-detect", () => ({
  get isMobile() {
    return device.isMobile;
  },
}));
vi.mock("../src/components/layout/Navigation", () => ({ default: () => <nav aria-label="Main navigation" /> }));
vi.mock("../src/components/FullScreenLoader", () => ({ default: () => <output>Loading page</output> }));
vi.mock("../src/components/CurrentCalendarTokenChooser", () => ({ default: () => null }));
vi.mock("react-toastify", () => ({ ToastContainer: () => null }));
const user = { id: "user-1", calendarToken: [] } as unknown as User;
const createTestStore = () =>
  configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer, authState: authReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
let store: ReturnType<typeof createTestStore>;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.useFakeTimers();
  device.isMobile = false;
  store = createTestStore();
  fetchMock = vi.fn<() => Promise<Response>>(
    async () =>
      new Response(JSON.stringify({ user, token: "refreshed" }), {
        headers: { "Content-Type": "application/json" },
      }),
  );
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  store.dispatch(baseApi.util.resetApiState());
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const showLayout = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    </Provider>,
  );

it("does not start refresh polling when logged out", async () => {
  showLayout();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3600000);
  });
  expect(fetchMock).not.toHaveBeenCalled();
});

it("does not start refresh polling on mobile", async () => {
  device.isMobile = true;
  store.dispatch(setCurrentUser(user));
  showLayout();
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3600000);
  });
  expect(fetchMock).not.toHaveBeenCalled();
});

it("refreshes desktop sessions every 30 minutes and stops polling after logout", async () => {
  store.dispatch(setCurrentUser(user));
  store.dispatch(setToken("initial"));
  showLayout();
  await act(async () => {
    await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
  });
  expect(fetchMock).toHaveBeenCalledTimes(1);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(1800010);
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
  act(() => {
    store.dispatch(setCurrentUser(null));
  });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(3600000);
  });
  expect(fetchMock).toHaveBeenCalledTimes(2);
});

const LoadedPage = () => <div>Loaded page</div>;

it("keeps navigation visible while a lazy page loads inside the layout", async () => {
  vi.useRealTimers();
  device.isMobile = true;
  store.dispatch(setCurrentUser(user));
  let resolvePage!: (module: { default: typeof LoadedPage }) => void;
  const loadPage = vi.fn<() => Promise<{ default: typeof LoadedPage }>>(
    () =>
      new Promise((resolve) => {
        resolvePage = resolve;
      }),
  );
  const LazyPage = lazy(loadPage);
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LazyPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  expect(loadPage).toHaveBeenCalledOnce();
  expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  expect(screen.getByRole("status").textContent).toBe("Loading page");
  await act(async () => {
    resolvePage({ default: LoadedPage });
  });
  expect(screen.getByText("Loaded page")).toBeTruthy();
  expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeTruthy();
  expect(screen.queryByRole("status")).toBeNull();
});
