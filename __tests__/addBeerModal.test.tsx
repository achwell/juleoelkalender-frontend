import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { Beer, BeerCalendar, Calendar } from "../src/types/generated";
import AddBeerModal from "../src/components/modals/AddBeerModal";
import { afterEach, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

afterEach(cleanup);

const createBeer = (id: string, name: string) =>
  ({
    id,
    name,
    style: "Stout",
    abv: 5,
    ibu: 30,
    ebc: 40,
    brewedDate: new Date("2026-01-01"),
    bottleDate: new Date("2026-02-01"),
    archived: false,
    brewer: {},
    reviews: [],
    createdDate: new Date("2026-01-01"),
  }) as Beer;

const calendar = { id: "calendar-1", name: "Test", year: 2026 } as Calendar;

it("adds the beer selected in the form instead of the initial beer", async () => {
  const callback = vi.fn<(beerCalendar: BeerCalendar) => void>();
  const beers = [createBeer("beer-1", "First"), createBeer("beer-2", "Second")];
  render(
    <AddBeerModal
      calendar={calendar}
      beers={beers}
      occupiedDays={[]}
      initialDay={1}
      isAddingBeerCalendar={false}
      show
      hide={vi.fn<() => void>()}
      callback={callback}
    />,
  );

  fireEvent.change(screen.getByRole("combobox"), { target: { value: "beer-2" } });
  fireEvent.click(screen.getAllByRole("button", { name: "buttons.save" })[0]);

  await waitFor(() => expect(callback).toHaveBeenCalledOnce());
  expect(callback.mock.calls[0][0].beer).toEqual(beers[1]);
});
