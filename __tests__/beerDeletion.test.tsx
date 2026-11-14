import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import BeerDetailsPage from "../src/pages/beers/details.page";

const mocks = vi.hoisted(() => ({
  remove: vi.fn<(id: string) => Promise<{ data?: object; error?: object }>>(),
  navigate: vi.fn<(path: string) => void>(),
  dispatch: vi.fn<(action: unknown) => void>(),
  success: vi.fn<(message: string) => void>(),
  error: vi.fn<(...args: unknown[]) => void>(),
}));
const beer = {
  id: "beer-1",
  name: "Stout",
  brewer: { id: "user-1" },
  brewedDate: "2026-01-01",
  bottleDate: "2026-02-01",
  archived: false,
};
vi.mock("../src/redux/api/beerApi", () => ({
  useGetBeerQuery: () => ({ data: beer, isFetching: false }),
  useDeleteBeerMutation: () => [mocks.remove, { isLoading: false }],
}));
vi.mock("../src/redux/api/beerCalendarApi", () => ({
  useGetBeerCalendarsQuery: () => ({ data: [], isFetching: false }),
}));
vi.mock("../src/redux/hooks", () => ({
  useAppDispatch: () => mocks.dispatch,
  useAppSelector: () => ({ currentUser: { id: "user-1", beers: [beer] } }),
}));
vi.mock("react-router", () => ({
  useNavigate: () => mocks.navigate,
  useParams: () => ({ id: "beer-1" }),
  useSearchParams: () => [new URLSearchParams()],
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => (key === "common.dateformat" ? "yyyy-MM-dd" : key) }),
}));
vi.mock("react-toastify", () => ({ toast: { success: mocks.success } }));
vi.mock("../src/utils", () => ({ handleErrorWithStatus: mocks.error }));
beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(cleanup);
const confirmDeletion = () => {
  render(<BeerDetailsPage />);
  fireEvent.click(screen.getAllByRole("button", { name: "buttons.delete" })[0]);
  fireEvent.click(screen.getAllByRole("button", { name: "delete.confirmdeletebutton" })[0]);
};

it("waits for successful deletion before navigating and reports success once", async () => {
  let resolve!: (result: { data: object }) => void;
  mocks.remove.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  confirmDeletion();
  expect(mocks.remove).toHaveBeenCalledExactlyOnceWith("beer-1");
  expect(mocks.navigate).not.toHaveBeenCalled();
  resolve({ data: { success: true } });
  await waitFor(() => expect(mocks.navigate).toHaveBeenCalledExactlyOnceWith("/beers"));
  expect(mocks.success).toHaveBeenCalledOnce();
});

it("keeps the page open and reports API errors without a success notification", async () => {
  const error = { status: 500, data: "Failed" };
  mocks.remove.mockResolvedValue({ error });
  confirmDeletion();
  await waitFor(() => expect(mocks.error).toHaveBeenCalledOnce());
  expect(mocks.navigate).not.toHaveBeenCalled();
  expect(mocks.success).not.toHaveBeenCalled();
});
