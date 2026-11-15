import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { StrictMode } from "react";
import { afterEach, expect, it } from "vitest";
import InputAutocomplete from "../src/components/form/InputAutocomplete";

const Form = ({ options }: { options: string[] }) => {
  const methods = useForm({ defaultValues: { style: "" } });
  return (
    <FormProvider {...methods}>
      <InputAutocomplete name="style" label="Style" options={options} />
    </FormProvider>
  );
};
afterEach(cleanup);

it("filters current options and selects them through the form controller", () => {
  const { rerender } = render(
    <StrictMode>
      <Form options={["Stout", "IPA"]} />
    </StrictMode>,
  );
  const input = screen.getByRole("combobox");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "st" } });
  expect(screen.queryByRole("option", { name: "IPA" })).toBeNull();
  expect(screen.getByRole("option", { name: "Stout" })).toBeTruthy();
  rerender(
    <StrictMode>
      <Form options={["Strong Ale"]} />
    </StrictMode>,
  );
  expect(screen.queryByRole("option", { name: "Stout" })).toBeNull();
  fireEvent.pointerDown(screen.getByRole("option", { name: "Strong Ale" }));
  expect((input as HTMLInputElement).value).toBe("Strong Ale");
  expect(screen.queryByRole("option", { name: "Strong Ale" })).toBeNull();
});

it("selects filtered options with the keyboard", () => {
  render(<Form options={["Stout", "IPA"]} />);
  const input = screen.getByRole("combobox");
  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: "ArrowDown" });
  fireEvent.keyDown(input, { key: "Enter" });
  expect((input as HTMLInputElement).value).toBe("IPA");
  expect(screen.queryByRole("listbox")).toBeNull();
});
