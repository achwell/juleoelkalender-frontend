import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import Navigation from "../src/components/layout/Navigation";
import { RoleName, type User } from "../src/types/generated";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock("../src/components/layout/LanguageSelector", () => ({ default: () => null }));

afterEach(cleanup);

const user = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  role: { name: RoleName.ROLE_USER, authorities: [] },
  locked: false,
  beers: [],
  calendarToken: [],
  createdDate: new Date("2026-01-01"),
  imageSilhouette: false,
} satisfies User;

it("opens the mobile menu and closes it with Escape", () => {
  render(
    <MemoryRouter>
      <Navigation currentUser={user} />
    </MemoryRouter>,
  );

  const toggle = screen.getByRole("button", { name: "menu.menu" });
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(toggle);
  const menu = screen.getByRole("navigation", { name: "menu.menu" });
  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(within(menu).getByRole("link", { name: "menu.calendars" }).getAttribute("href")).toBe("/calendar");
  fireEvent.keyDown(document, { key: "Escape" });
  expect(screen.queryByRole("navigation", { name: "menu.menu" })).toBeNull();
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(toggle);
});

it("closes the mobile menu when a link is selected", () => {
  render(
    <MemoryRouter>
      <Navigation currentUser={user} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "menu.menu" }));
  const menu = screen.getByRole("navigation", { name: "menu.menu" });
  fireEvent.click(within(menu).getByRole("link", { name: "menu.calendars" }));
  expect(screen.queryByRole("navigation", { name: "menu.menu" })).toBeNull();
});
