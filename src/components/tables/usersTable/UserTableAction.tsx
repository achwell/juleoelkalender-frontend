import ActionKnapper from "@/components/ActionKnapper";
import { ButtonType } from "@/types/ButtonProps";
import { User } from "@/types/generated";
import { hasAuthority } from "@/utils";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    user: User;
    currentUser: User | null | undefined;
    viewUser: (user: User) => void;
    showDeleteUser: (user: User) => void;
    unlock: (user: User) => void;
}

const UserTableAction: FC<Props> = ({ user, currentUser, viewUser, showDeleteUser, unlock }) => {
    const { t } = useTranslation();
    return (
        <ActionKnapper
            key={`renderRowActions-${user.id}`}
            id={`renderRowActions-${user.id}`}
            buttons={[
                {
                    icon: ButtonType.EDIT,
                    text: t("buttons.edit"),
                    hidden: !hasAuthority(currentUser, "user:update_other"),
                    onClick: () => viewUser(user),
                },
                {
                    icon: ButtonType.UNLOCK,
                    hidden: !hasAuthority(currentUser, "user:update_other") || !user.locked,
                    variant: "text",
                    text: t("pages.users.unlockuser"),
                    onClick: () => unlock(user),
                },
                {
                    icon: ButtonType.DELETE,
                    text: t("buttons.delete"),
                    color: "error",
                    variant: "text",
                    hidden: !hasAuthority(currentUser, "user:delete") || user.id === currentUser?.id,
                    disabled: user.beers.length > 0,
                    onClick: () => showDeleteUser(user),
                },
            ]}
        />
    );
};
export default UserTableAction;
