import ActionKnapper from "@/components/ActionKnapper";
import { useDownloadAllUsersExcelMutation } from "@/redux/api/userApi";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { hasAuthority } from "@/utils";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
    showAddUser: () => void;
    setActiveOnly: (value: ((prevState: boolean) => boolean) | boolean) => void;
    activeOnly: boolean;
}

const UsersTableActionButtons: FC<Props> = ({ showAddUser, setActiveOnly, activeOnly }) => {
    const { i18n, t } = useTranslation();
    const [downloadReport] = useDownloadAllUsersExcelMutation();
    const { currentUser } = useAppSelector((state) => state.authState);

    const toggleViewActiveOnly = () => {
        setActiveOnly((prev) => !prev);
    };

    return (
        <ActionKnapper
            buttons={[
                {
                    text: t("buttons.add", {
                        field: t("pages.users.user"),
                    }),
                    variant: "contained",
                    icon: ButtonType.NEW,
                    hidden: !hasAuthority(currentUser, "user:create"),
                    onClick: showAddUser,
                },
                {
                    variant: "text",
                    color: "primary",
                    icon: ButtonType.EXCEL,
                    onClick: () => {
                        const name = t("pages.users.excelexportfilename");
                        const language = i18n.language;
                        downloadReport({
                            name,
                            language,
                        });
                    },
                },
                {
                    text: activeOnly ? t("usersTable.show.all") : t("usersTable.show.active"),
                    variant: "text",
                    icon: ButtonType.VIEW,
                    onClick: toggleViewActiveOnly,
                },
            ]}
        />
    );
};
export default UsersTableActionButtons;
