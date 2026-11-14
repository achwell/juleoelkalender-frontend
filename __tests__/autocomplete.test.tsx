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
  const input = screen.getByRole("textbox");
  fireEvent.focus(input);
  fireEvent.change(input, { target: { value: "st" } });
  expect(screen.queryByRole("button", { name: "IPA" })).toBeNull();
  expect(screen.getByRole("button", { name: "Stout" })).toBeTruthy();
  rerender(
    <StrictMode>
      <Form options={["Strong Ale"]} />
    </StrictMode>,
  );
  expect(screen.queryByRole("button", { name: "Stout" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Strong Ale" }));
  expect((input as HTMLInputElement).value).toBe("Strong Ale");
  expect(screen.queryByRole("button", { name: "Strong Ale" })).toBeNull();
});
