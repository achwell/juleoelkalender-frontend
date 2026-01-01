import Table from "@/components/table/Table";
import UsersTableActionButtons from "@/components/tables/usersTable/UsersTableActionButtons";
import columns from "@/components/tables/usersTable/columns";
import { useUpdateUserMutation } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { User } from "@/types/generated";
import { getNameOfUser, handleError, hasAuthority } from "@/utils";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface Props {
    users: User[];
    viewUser: (user: User) => void;
    showDeleteUser: (user: User) => void;
    showAddUser: () => void;
    callback: () => void;
}

const UsersTable: FC<Props> = ({ users, viewUser, showDeleteUser, showAddUser, callback }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.authState);
    const [updateUser, { isLoading, isSuccess, data, isError, error }] = useUpdateUserMutation();
    const [canSeeLastLogin, setCanSeeLastLogin] = useState(false);
    const [activeOnly, setActiveOnly] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setCanSeeLastLogin(hasAuthority(currentUser, "user:seelogintime"));
        }
    }, [currentUser]);

    useEffect(() => {
        const finish = async () => {
            if (!isLoading) {
                if (isSuccess && data) {
                    toast.success(
                        t("pages.users.wasunlocked", {
                            name: getNameOfUser(data),
                        })
                    );
                    callback();
                    navigate("/admin/users");
                } else if (isError && error) {
                    handleError(t, error);
                }
            }
        };
        finish();
    }, [isLoading]);

    const unlock = (user: User) => {
        updateUser({
            ...user,
            locked: false,
        });
    };

    const activeFilter = (user: User) => {
        return !activeOnly || user.calendarToken.filter((c) => c.active).length > 0;
    };

    if (!currentUser) return null;

    return (
        <div className="w-full p-4">
            <Table
                data={users.filter(activeFilter)}
                cols={columns(t, users, canSeeLastLogin, currentUser, viewUser, showDeleteUser, unlock)}
                actionButtons={
                    <UsersTableActionButtons
                        showAddUser={showAddUser}
                        setActiveOnly={setActiveOnly}
                        activeOnly={activeOnly}
                    />
                }
            />
        </div>
    );
};
export default UsersTable;
