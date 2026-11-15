import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import ActionKnapper from "../src/components/ActionKnapper";
import { ButtonType } from "../src/types/ButtonProps";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

afterEach(cleanup);

it("submits a form from the mobile submit button without invoking its click handler", () => {
  const onSubmit = vi.fn<(event: React.FormEvent) => void>((event) => event.preventDefault());
  const onClick = vi.fn<() => void>();
  const { container } = render(
    <form onSubmit={onSubmit}>
      <ActionKnapper buttons={[{ icon: ButtonType.SUBMIT, text: "Save", onClick }]} />
    </form>,
  );
  const mobileButtons = container.querySelectorAll("fieldset")[1];
  const button = within(mobileButtons).getByRole("button");
  expect(button.getAttribute("type")).toBe("submit");
  fireEvent.click(button);
  expect(onSubmit).toHaveBeenCalledOnce();
  expect(onClick).not.toHaveBeenCalled();
});

it("does not render hidden actions on either layout", () => {
  render(<ActionKnapper buttons={[{ icon: ButtonType.DELETE, text: "Delete", hidden: true }]} />);
  expect(screen.queryAllByRole("button")).toHaveLength(0);
});
