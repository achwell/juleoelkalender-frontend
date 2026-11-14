import { configureStore } from "@reduxjs/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { baseApi } from "../src/redux/api/baseApi";
import { beerApi } from "../src/redux/api/beerApi";
import { reviewApi } from "../src/redux/api/reviewApi";
import { authApi } from "../src/redux/api/authApi";
import { refreshApi } from "../src/redux/api/refreshApi";
import { actuatorApi } from "../src/redux/api/actuatorApi";
import { logApi } from "../src/redux/api/logApi";
import { calendarTokenApi } from "../src/redux/api/calendarTokenApi";
import { beerStyleApi } from "../src/redux/api/beerStyleApi";
import { calendarApi } from "../src/redux/api/calendarApi";
import { beerCalendarApi } from "../src/redux/api/beerCalendarApi";
import { passwordChangeRequestApi } from "../src/redux/api/passwordChangeRequestApi";
import { userApi } from "../src/redux/api/userApi";
import { dashboardApi } from "../src/redux/api/dashboardApi";
import authReducer, { setToken } from "../src/redux/features/authSlice";
import { BASE_URL } from "../src/environment";

const createTestStore = () =>
  configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer, authState: authReducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
let store: ReturnType<typeof createTestStore>;
let requests: Request[];

beforeEach(() => {
  store = createTestStore();
  store.dispatch(setToken("test-token"));
  requests = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      requests.push(request);
      return new Response(JSON.stringify({ id: "beer-1" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );
});
afterEach(() => {
  store.dispatch(baseApi.util.resetApiState());
  vi.unstubAllGlobals();
});

describe("shared API", () => {
  it("uses one reducer/cache for every feature", () => {
    for (const api of [
      beerApi,
      reviewApi,
      authApi,
      refreshApi,
      actuatorApi,
      logApi,
      calendarTokenApi,
      beerStyleApi,
      calendarApi,
      beerCalendarApi,
      passwordChangeRequestApi,
      userApi,
      dashboardApi,
    ]) {
      expect(api).toBe(baseApi);
    }
  });

  it("preserves URLs, request methods and public/protected authorization behavior", async () => {
    await store.dispatch(beerApi.endpoints.getBeer.initiate("beer-1")).unwrap();
    await store.dispatch(refreshApi.endpoints.refresh.initiate("")).unwrap();
    await store.dispatch(authApi.endpoints.userExist.initiate("test@example.no")).unwrap();
    await store.dispatch(actuatorApi.endpoints.httpexchanges.initiate()).unwrap();
    await store.dispatch(logApi.endpoints.logDevice.initiate({ isMobile: false })).unwrap();
    expect(requests.map((r) => r.url)).toEqual([
      `${BASE_URL}/api/v1/beer/beer-1`,
      `${BASE_URL}/api/v1/auth/refresh`,
      `${BASE_URL}/api/v1/auth/userExist/test@example.no`,
      `${BASE_URL}/actuator/httpexchanges`,
      `${BASE_URL}/api/v1/log/logDevice`,
    ]);
    expect(requests.map((r) => r.headers.get("authorization"))).toEqual([
      "Bearer test-token",
      "Bearer test-token",
      null,
      null,
      null,
    ]);
    expect(requests.every((r) => r.credentials === "include")).toBe(true);
    expect(requests[4].method).toBe("POST");
  });

  it("refreshes subscribed beer data after saving a review in another feature", async () => {
    const subscription = store.dispatch(beerApi.endpoints.getBeer.initiate("beer-1"));
    await subscription.unwrap();
    await store.dispatch(reviewApi.endpoints.addReview.initiate({ comment: "Great" })).unwrap();
    await vi.waitFor(() => expect(requests.filter((r) => r.url.endsWith("/beer/beer-1"))).toHaveLength(2));
    subscription.unsubscribe();
  });

  it("does not refetch beer data when logging a device", async () => {
    const subscription = store.dispatch(beerApi.endpoints.getBeer.initiate("beer-1"));
    await subscription.unwrap();
    await store.dispatch(logApi.endpoints.logDevice.initiate({ isMobile: false })).unwrap();
    await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
    expect(requests.filter((r) => r.url.endsWith("/beer/beer-1"))).toHaveLength(1);
    subscription.unsubscribe();
  });
});
