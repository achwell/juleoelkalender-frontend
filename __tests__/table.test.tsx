import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Table from "../src/components/table/Table";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock("../src/components/table/pagination/Pagination", () => ({ default: () => null }));
afterEach(cleanup);

const columns = (header: string, action: () => void) => [
  {
    accessorKey: "name",
    header,
    enableColumnFilter: false,
    cell: () => <button onClick={action}>Choose</button>,
  },
];

it("updates translated headers and cell callbacks when column props change", () => {
  const oldAction = vi.fn<() => void>();
  const newAction = vi.fn<() => void>();
  const data = [{ name: "Beer" }];
  const { rerender } = render(<Table data={data} columns={columns("Old name", oldAction)} disableGlobalFilters />);
  expect(screen.getByText("Old name")).toBeTruthy();
  rerender(<Table data={data} columns={columns("Nytt navn", newAction)} disableGlobalFilters />);
  expect(screen.queryByText("Old name")).toBeNull();
  expect(screen.getByText("Nytt navn")).toBeTruthy();
  fireEvent.click(screen.getByText("Choose"));
  expect(newAction).toHaveBeenCalledOnce();
  expect(oldAction).not.toHaveBeenCalled();
});

it("updates sorted rows and fresh data while column resizing is active", () => {
  const resizingColumns = [{ accessorKey: "name", header: "Name", enableColumnFilter: false }];
  const { rerender } = render(
    <Table data={[{ name: "Stout" }, { name: "Ale" }]} columns={resizingColumns} disableGlobalFilters />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Name" }));
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["Ale", "Stout"]);
  fireEvent.mouseDown(screen.getByRole("button", { name: "Resize column" }), { button: 0, clientX: 50 });
  rerender(<Table data={[{ name: "Porter" }, { name: "Lager" }]} columns={resizingColumns} disableGlobalFilters />);
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["Lager", "Porter"]);
  fireEvent.mouseUp(document);
});
