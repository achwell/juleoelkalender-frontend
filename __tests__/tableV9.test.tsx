import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { memo } from "react";
import { useTable } from "@tanstack/react-table";
import { afterEach, expect, it, vi } from "vitest";
import Table from "../src/components/table/Table";
import TableHeader from "../src/components/table/TableHeader";
import Filter from "../src/components/table/filter/Filter";
import { features } from "../src/components/table/tableFeatures";
import { createColumnHelper } from "../src/components/table/tableTypes";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const helper = createColumnHelper<{ name: string }>();
const columns = helper.columns([helper.accessor("name", { header: "Name", enableColumnFilter: false })]);
const data = Array.from({ length: 12 }, (_, i) => ({ name: `Beer ${i + 1}` }));

it("paginates through all rows and changes page size using the v9 state store", () => {
  render(<Table data={data} columns={columns} />);
  expect(screen.getAllByRole("cell")).toHaveLength(10);
  fireEvent.click(screen.getByRole("button", { name: "table.pagination.next" }));
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["Beer 11", "Beer 12"]);
  fireEvent.click(screen.getByRole("button", { name: "table.pagination.previous" }));
  expect(screen.getAllByRole("cell")).toHaveLength(10);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "20" } });
  expect(screen.getAllByRole("cell")).toHaveLength(12);
});

it("filters globally with the registered fuzzy function and clears the filter", async () => {
  vi.useFakeTimers();
  render(<Table data={[{ name: "Stout" }, { name: "IPA" }]} columns={columns} />);
  const search = screen.getByRole("textbox");
  fireEvent.change(search, { target: { value: "stout" } });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(screen.getAllByRole("cell").map((cell) => cell.textContent)).toEqual(["Stout"]);
  fireEvent.change(search, { target: { value: "" } });
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  expect(screen.getAllByRole("cell")).toHaveLength(2);
});

it("updates column sizing while dragging and resets it on double click", () => {
  const { container } = render(<Table data={data} columns={columns} disableGlobalFilters />);
  const table = container.querySelector("table")!;
  const size = () => Number.parseFloat(table.style.getPropertyValue("--col-name-size"));
  const initialSize = size();
  const resize = screen.getByRole("button", { name: "Resize column" });
  fireEvent.mouseDown(resize, { button: 0, clientX: 50 });
  fireEvent.mouseMove(document, { clientX: 100 });
  fireEvent.mouseUp(document, { clientX: 100 });
  expect(size()).toBeGreaterThan(initialSize);
  fireEvent.doubleClick(resize);
  expect(size()).toBe(initialSize);
});

// Memoized children reproduce the stable-object boundary that also matters to React Compiler.
const MemoizedHeader = memo(TableHeader) as typeof TableHeader;
const MemoizedFilter = memo(Filter) as typeof Filter;
const filterColumns = helper.columns([helper.accessor("name", { header: "Subscribed name" })]);
const subscribedData = [{ name: "Stout" }, { name: "IPA" }];
const SubscribedTable = () => {
  const table = useTable({ features, columns: filterColumns, data: subscribedData });
  const column = table.getColumn("name")!;
  const header = table.getHeaderGroups()[0].headers[0];
  return (
    <>
      <table>
        <thead>
          <tr>
            <MemoizedHeader header={header} small={false} />
          </tr>
        </thead>
      </table>
      <MemoizedFilter column={column} />
      <button onClick={() => column.setFilterValue("IPA")}>Set filter</button>
      <output>
        {table
          .getRowModel()
          .rows.map((row) => row.original.name)
          .join(",")}
      </output>
    </>
  );
};

it("keeps memoized headers and column filters subscribed to changing table state", () => {
  render(<SubscribedTable />);
  fireEvent.click(screen.getByRole("button", { name: "Subscribed name" }));
  expect(screen.getByRole("button", { name: /Subscribed name/ }).textContent).toContain("🔼");
  fireEvent.click(screen.getByRole("button", { name: "Set filter" }));
  expect(screen.getAllByRole("textbox").every((input) => (input as HTMLInputElement).value === "IPA")).toBe(true);
  expect(screen.getByRole("status").textContent).toBe("IPA");
});
