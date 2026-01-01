import { useAppSelector } from "@/redux/hooks";
import { NameEnum } from "@/types/generated";
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
        role: NameEnum
    ) => {
        // @ts-ignore
        const { checked } = e.target;
        const existingValues = columnFilterValue.split(",");

        return column.setFilterValue(
            (checked ? [...existingValues, role] : existingValues.filter((s) => s !== role)).join(",")
        );
    };
    if (!role || role === NameEnum.ROLE_USER) return null;
    return (
        <fieldset className="w-36 border shadow rounded bg-white p-2">
            {role === NameEnum.ROLE_MASTER && (
                <label className="flex items-start">
                    <input
                        type="checkbox"
                        value={NameEnum.ROLE_MASTER}
                        name="role"
                        className="mt-1 mr-2 shrink-0"
                        onClick={(e) =>
                            toggleRole(
                                e,
                                columnFilterValue ? (columnFilterValue as string) : "",
                                column,
                                NameEnum.ROLE_MASTER
                            )
                        }
                    />
                    {getRoleDescription(t, NameEnum.ROLE_MASTER)}
                </label>
            )}
            {role === NameEnum.ROLE_ADMIN ||
                (role === NameEnum.ROLE_MASTER && (
                    <label className="flex items-start">
                        <input
                            type="checkbox"
                            value={NameEnum.ROLE_ADMIN}
                            name="role"
                            className="mt-1 mr-2 shrink-0"
                            onClick={(e) =>
                                toggleRole(
                                    e,
                                    columnFilterValue ? (columnFilterValue as string) : "",
                                    column,
                                    NameEnum.ROLE_ADMIN
                                )
                            }
                        />
                        {getRoleDescription(t, NameEnum.ROLE_ADMIN)}
                    </label>
                ))}
            <label className="flex items-start">
                <input
                    type="checkbox"
                    value={NameEnum.ROLE_USER}
                    name="role"
                    className="mt-1 mr-2 shrink-0"
                    onClick={(e) =>
                        toggleRole(
                            e,
                            columnFilterValue ? (columnFilterValue as string) : "",
                            column,
                            NameEnum.ROLE_USER
                        )
                    }
                />
                {getRoleDescription(t, NameEnum.ROLE_USER)}
            </label>
        </fieldset>
    );
};
export default RoleFilter;
