import { render } from "@testing-library/react";
import { MdVisibility } from "react-icons/md";
import { describe, expect, it } from "vitest";
import {
  getErrorContainedButton,
  getIconButton,
  getIconSubmitButton,
  getPrimaryContainedButton,
  getPrimaryTextButton,
  getPrimaryTextSubmitButton,
  getSecondaryContainedButton,
  getSecondaryTextButton,
} from "../src/buttonUtils";
import { ButtonType } from "../src/types/ButtonProps";

describe("buttonUtils", () => {
  it("getPrimaryContainedButton", () => {
    const primaryContainedButton = getPrimaryContainedButton(1, { icon: ButtonType.LOGIN }, undefined);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getPrimaryContainedButton with onClick", () => {
    const primaryContainedButton = getPrimaryContainedButton(
      1,
      {
        icon: ButtonType.LOGIN,
        onClick: () => {},
      },
      undefined,
    );
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getPrimaryTextSubmitButton", () => {
    const primaryContainedButton = getPrimaryTextSubmitButton(1, { icon: ButtonType.LOGIN }, undefined);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getPrimaryTextButton", () => {
    const primaryContainedButton = getPrimaryTextButton(1, { icon: ButtonType.LOGIN }, undefined);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getSecondaryContainedButton", () => {
    const primaryContainedButton = getSecondaryContainedButton(1, { icon: ButtonType.LOGIN }, undefined);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getSecondaryTextButton", () => {
    const primaryContainedButton = getSecondaryTextButton(1, { icon: ButtonType.LOGIN }, undefined);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getErrorContainedButton", () => {
    const primaryContainedButton = getErrorContainedButton(1, { icon: ButtonType.LOGIN }, undefined);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getIconButton without onClick", () => {
    const primaryContainedButton = getIconButton(1, { icon: ButtonType.LOGIN }, <MdVisibility title="" />);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getIconButton with onClick", () => {
    const primaryContainedButton = getIconButton(
      1,
      {
        icon: ButtonType.LOGIN,
        onClick: () => {},
      },
      <MdVisibility title="" />,
    );
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("disables icon buttons on mobile while a request is pending", () => {
    const button = getIconButton(
      1,
      {
        icon: ButtonType.LOGIN,
        onClick: () => {},
        disabled: true,
      },
      <MdVisibility title="" />,
    );
    const { container } = render(button);
    expect(container.querySelector("button")?.disabled).toBe(true);
  });
  it("getIconSubmitButton without onClick", () => {
    const primaryContainedButton = getIconSubmitButton(1, { icon: ButtonType.LOGIN }, <MdVisibility title="" />);
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("getIconSubmitButton with onClick", () => {
    const primaryContainedButton = getIconSubmitButton(
      1,
      {
        icon: ButtonType.LOGIN,
        onClick: () => {},
      },
      <MdVisibility title="" />,
    );
    const { container } = render(primaryContainedButton);
    expect(container.firstChild).toMatchSnapshot();
  });
});
