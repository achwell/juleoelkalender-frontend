import type { RowData } from "@tanstack/react-table";
import { useAppSelector } from "@/redux/hooks";
import { RoleName } from "@/types/generated";
import TextFunction from "@/types/TextFunction";
import { getRoleDescription } from "@/utils";
import { Column } from "@/components/table/tableTypes";
import { MouseEvent } from "react";

const toggleRole = <T extends RowData>(
  e: MouseEvent<HTMLInputElement>,
  columnFilterValueValue: string,
  columnValue: Column<T>,
  roleValue: RoleName,
) => {
  // @ts-ignore
  const { checked } = e.target;
  const existingValues = columnFilterValueValue.split(",");

  return columnValue.setFilterValue(
    (checked ? [...existingValues, roleValue] : existingValues.filter((s) => s !== roleValue)).join(","),
  );
};

interface Props<T extends RowData> {
  t: TextFunction;
  column: Column<T>;
  filterValue?: unknown;
}

const RoleFilter = <T extends RowData>({ t, column, filterValue: columnFilterValue }: Props<T>) => {
  const { currentUser } = useAppSelector((state) => state.authState);
  const role = currentUser?.role?.name;

  if (!role || role === RoleName.ROLE_USER) {
    return null;
  }
  return (
    <fieldset className="w-36 border shadow rounded bg-white p-2">
      {role === RoleName.ROLE_MASTER && (
        <label className="flex items-start">
          <input
            type="checkbox"
            value={RoleName.ROLE_MASTER}
            name="role"
            className="mt-1 mr-2 shrink-0"
            onClick={(e) =>
              toggleRole(e, columnFilterValue ? (columnFilterValue as string) : "", column, RoleName.ROLE_MASTER)
            }
          />
          {getRoleDescription(t, RoleName.ROLE_MASTER)}
        </label>
      )}
      {role === RoleName.ROLE_ADMIN ||
        (role === RoleName.ROLE_MASTER && (
          <label className="flex items-start">
            <input
              type="checkbox"
              value={RoleName.ROLE_ADMIN}
              name="role"
              className="mt-1 mr-2 shrink-0"
              onClick={(e) =>
                toggleRole(e, columnFilterValue ? (columnFilterValue as string) : "", column, RoleName.ROLE_ADMIN)
              }
            />
            {getRoleDescription(t, RoleName.ROLE_ADMIN)}
          </label>
        ))}
      <label className="flex items-start">
        <input
          type="checkbox"
          value={RoleName.ROLE_USER}
          name="role"
          className="mt-1 mr-2 shrink-0"
          onClick={(e) =>
            toggleRole(e, columnFilterValue ? (columnFilterValue as string) : "", column, RoleName.ROLE_USER)
          }
        />
        {getRoleDescription(t, RoleName.ROLE_USER)}
      </label>
    </fieldset>
  );
};
export default RoleFilter;
