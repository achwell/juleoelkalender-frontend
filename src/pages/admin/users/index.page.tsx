import ActionKnapper from "@/components/ActionKnapper";
import FullScreenLoader from "@/components/FullScreenLoader";
import ModalDialog from "@/components/ModalDialog";
import H1 from "@/components/layout/H1";
import UsersTable from "@/components/tables/usersTable/UsersTable";
import { useDeleteUserMutation, useGetUsersQuery } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { User } from "@/types/generated";
import { getNameOfUser, handleError } from "@/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const UsersPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.authState);
    const { data: users, refetch } = useGetUsersQuery();
    const [
        deleteUser,
        { isLoading: isDeleting, isSuccess: isSuccessDeleting, error: errorDelete, isError: isErrorDeleting },
    ] = useDeleteUserMutation();

    const [showDelete, setShowDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();

    useEffect(() => {
        const finish = async () => {
            if (!isDeleting) {
                if (isSuccessDeleting && selectedUser) {
                    toast.success(t("delete.deleted", { name: getNameOfUser(selectedUser) }));
                    await refetch();
                    navigate("/admin/users");
                } else if (isErrorDeleting && errorDelete) {
                    handleError(t, errorDelete);
                    await refetch();
                }
                close();
                setSelectedUser(undefined);
            }
        };
        finish();
    }, [isDeleting]);

    const deleteUsr = () => {
        if (selectedUser?.id) {
            deleteUser(selectedUser.id);
        }
    };

    const viewUser = async (value: User) => {
        setShowDelete(false);
        setSelectedUser(value);
        if (value.id) {
            navigate(`/admin/users/${value.id}`);
        }
    };

    const showDeleteUser = (value: User) => {
        setSelectedUser(value);
        setShowDelete(true);
    };

    const close = () => {
        setSelectedUser(undefined);
        setShowDelete(false);
    };

    if (!currentUser || !users) return <FullScreenLoader />;

    return (
        <div className="w-full p-4">
            <H1>{t("pages.users.header")}</H1>
            <ModalDialog
                show={showDelete}
                hide={close}
                title={t("delete.delete", { name: getNameOfUser(selectedUser) })}
            >
                <p className="mt-2 mb-2 text-gray-500">
                    {t("delete.confirmdeletetext", { name: getNameOfUser(selectedUser) })}
                </p>
                <ActionKnapper
                    buttons={[
                        {
                            onClick: deleteUsr,
                            icon: ButtonType.DELETE,
                            text: isDeleting
                                ? t("delete.deleting")
                                : t("delete.confirmdeletemessage", {
                                      name: getNameOfUser(selectedUser),
                                  }),
                            disabled: isDeleting,
                        },
                        {
                            onClick: close,
                            icon: ButtonType.CANCEL,
                            text: t("buttons.cancel"),
                        },
                    ]}
                />
            </ModalDialog>
            <UsersTable
                users={users}
                viewUser={viewUser}
                showDeleteUser={showDeleteUser}
                showAddUser={async () => navigate("/admin/users/new")}
                callback={refetch}
            />
        </div>
    );
};

export default UsersPage;
