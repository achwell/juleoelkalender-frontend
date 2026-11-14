import Table from "@/components/table/Table";
import columns from "@/components/tables/usersTable/columns";
import UsersTableActionButtons from "@/components/tables/usersTable/UsersTableActionButtons";
import { useUpdateUserMutation } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { User } from "@/types/generated";
import { getNameOfUser, handleErrorWithStatus, hasAuthority } from "@/utils";
import { FC, useState } from "react";
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
  const [updateUserRequest] = useUpdateUserMutation();
  const updateUser = async (...args: Parameters<typeof updateUserRequest>) => {
    const result = await updateUserRequest(...args);

    if ("data" in result && result.data) {
      toast.success(
        t("pages.users.wasunlocked", {
          name: getNameOfUser(result.data),
        }),
      );
      callback();
      navigate("/admin/users");
    } else if ("error" in result && result.error) {
      handleErrorWithStatus(t, result.error);
    }

    return result;
  };

  const canSeeLastLogin = !!currentUser && hasAuthority(currentUser, "user:seelogintime");
  const [activeOnly, setActiveOnly] = useState(true);

  const unlock = (user: User) => {
    updateUser({
      ...user,
      locked: false,
    });
  };

  const activeFilter = (user: User) => {
    return !activeOnly || user.calendarToken.some((c) => c.active);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="w-full p-4">
      <Table
        data={users.filter(activeFilter)}
        columns={columns(t, users, canSeeLastLogin, currentUser, viewUser, showDeleteUser, unlock)}
        actionButtons={
          <UsersTableActionButtons showAddUser={showAddUser} setActiveOnly={setActiveOnly} activeOnly={activeOnly} />
        }
      />
    </div>
  );
};
export default UsersTable;
