import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import DebouncedInput from "../src/components/table/filter/DebouncedInput";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("debounces typing and calls the latest callback once", () => {
  vi.useFakeTimers();
  const first = vi.fn<(value: string | number) => void>();
  const latest = vi.fn<(value: string | number) => void>();
  const { rerender } = render(<DebouncedInput value="" onChange={first} />);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(first).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });
  act(() => {
    vi.advanceTimersByTime(250);
  });
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "ale" } });
  rerender(<DebouncedInput value="" onChange={latest} />);
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(first).not.toHaveBeenCalled();
  expect(latest).toHaveBeenCalledExactlyOnceWith("ale");
});

it("cancels pending edits when the external filter resets and when unmounted", () => {
  vi.useFakeTimers();
  const onChange = vi.fn<(value: string | number) => void>();
  const { rerender, unmount } = render(<DebouncedInput value="old" onChange={onChange} />);
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "draft" } });
  rerender(<DebouncedInput value="" onChange={onChange} />);
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.change(screen.getByRole("textbox"), { target: { value: "another" } });
  unmount();
  act(() => {
    vi.advanceTimersByTime(500);
  });
  expect(onChange).not.toHaveBeenCalled();
  expect(vi.getTimerCount()).toBe(0);
});
