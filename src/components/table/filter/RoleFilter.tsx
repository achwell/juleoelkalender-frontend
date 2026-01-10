import { useAppSelector } from "@/redux/hooks";
import { RoleName } from "@/types/generated";
import { getRoleDescription } from "@/utils";
import { Column } from "@tanstack/react-table";
import { FC, MouseEvent } from "react";

interface Props {
    t: (key: string) => string;
    column: Column<any>;
}
const RoleFilter: FC<Props> = ({ t, column }) => {
    const { currentUser } = useAppSelector((state) => state.authState);
    const role = currentUser?.role?.name;
    const columnFilterValue = column.getFilterValue();
    const toggleRole = (
        e: MouseEvent<HTMLInputElement>,
        columnFilterValue: string,
        column: Column<any>,
        role: RoleName
    ) => {
        // @ts-ignore
        const { checked } = e.target;
        const existingValues = columnFilterValue.split(",");

        return column.setFilterValue(
            (checked ? [...existingValues, role] : existingValues.filter((s) => s !== role)).join(",")
        );
    };
    if (!role || role === RoleName.ROLE_USER) return null;
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
                            toggleRole(
                                e,
                                columnFilterValue ? (columnFilterValue as string) : "",
                                column,
                                RoleName.ROLE_MASTER
                            )
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
                                toggleRole(
                                    e,
                                    columnFilterValue ? (columnFilterValue as string) : "",
                                    column,
                                    RoleName.ROLE_ADMIN
                                )
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
                        toggleRole(
                            e,
                            columnFilterValue ? (columnFilterValue as string) : "",
                            column,
                            RoleName.ROLE_USER
                        )
                    }
                />
                {getRoleDescription(t, RoleName.ROLE_USER)}
            </label>
        </fieldset>
    );
};
export default RoleFilter;
