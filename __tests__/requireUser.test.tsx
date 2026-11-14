import { act, cleanup, render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, expect, it } from "vitest";
import RequireUser from "../src/components/requireUser";
import authReducer, { setCurrentUser } from "../src/redux/features/authSlice";
import type { User } from "../src/types/generated";

const user = (allowed: boolean) =>
  ({
    id: "user",
    role: { name: "ROLE_USER", authorities: allowed ? [{ name: "beer:read" }] : [] },
  }) as unknown as User;
const showPage = (allowed: boolean) => {
  const store = configureStore({ reducer: { authState: authReducer } });
  store.dispatch(setCurrentUser(user(allowed)));
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Routes>
          <Route element={<RequireUser requiredAutorities={["beer:read"]} />}>
            <Route path="/" element={<div>Private page</div>} />
          </Route>
          <Route path="/unauthorized" element={<div>Access denied</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
  return store;
};
afterEach(cleanup);

it("denies users without any matching authority", () => {
  showPage(false);
  expect(screen.getByText("Access denied")).toBeTruthy();
  expect(screen.queryByText("Private page")).toBeNull();
});
it("reacts when the signed-in user's authority is revoked", () => {
  const store = showPage(true);
  expect(screen.getByText("Private page")).toBeTruthy();
  act(() => {
    store.dispatch(setCurrentUser(user(false)));
  });
  expect(screen.getByText("Access denied")).toBeTruthy();
});
