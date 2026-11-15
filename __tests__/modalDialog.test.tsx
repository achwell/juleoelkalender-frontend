import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ModalDialog from "../src/components/ModalDialog";
import { afterEach, expect, it, vi } from "vitest";

afterEach(cleanup);

it("labels the dialog, traps focus, and closes with Escape", () => {
  const hide = vi.fn<() => void>();
  render(
    <>
      <button type="button">Open dialog</button>
      <ModalDialog show hide={hide} title="Confirm">
        <button type="button">Confirm action</button>
      </ModalDialog>
    </>,
  );

  const dialog = screen.getByRole("dialog", { name: "Confirm" });
  const closeButton = screen.getByRole("button", { name: "Close dialog" });
  expect(document.activeElement).toBe(closeButton);
  expect(dialog.contains(screen.getByRole("heading", { name: "Confirm" }))).toBe(true);

  const confirmButton = screen.getByRole("button", { name: "Confirm action" });
  confirmButton.focus();
  fireEvent.keyDown(dialog, { key: "Tab" });
  expect(document.activeElement).toBe(closeButton);

  fireEvent.keyDown(dialog, { key: "Escape" });
  expect(hide).toHaveBeenCalledOnce();
});

it("closes when the backdrop is clicked", () => {
  const hide = vi.fn<() => void>();
  render(
    <ModalDialog show hide={hide} title="Confirm">
      <button type="button">Confirm action</button>
    </ModalDialog>,
  );

  fireEvent.mouseDown(screen.getByRole("dialog"), { target: screen.getByRole("dialog") });
  expect(hide).toHaveBeenCalledOnce();
});

it("skips hidden controls when wrapping focus", () => {
  render(
    <ModalDialog show hide={vi.fn<() => void>()} title="Confirm">
      <button type="button">Visible action</button>
      <div style={{ display: "none" }}>
        <button type="button">Hidden action</button>
      </div>
      <button type="button" tabIndex={-1}>
        Not in tab order
      </button>
      <fieldset disabled>
        <button type="button">Disabled action</button>
      </fieldset>
    </ModalDialog>,
  );
  const closeButton = screen.getByRole("button", { name: "Close dialog" });
  const visibleButton = screen.getByRole("button", { name: "Visible action" });
  visibleButton.focus();
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
  expect(document.activeElement).toBe(closeButton);
  fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(visibleButton);
});
