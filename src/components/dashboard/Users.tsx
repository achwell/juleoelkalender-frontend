import Paragraph from "@/components/layout/Paragraph";
import { User } from "@/types/generated";
import { getNameOfUser } from "@/utils";
import { format } from "date-fns-tz";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const Users: FC<{
    numberOfActiveUsers: number;
    numberOfUsers: number;
    newestUser: User | null;
    newestActiveUser: User | null;
}> = ({ numberOfActiveUsers, numberOfUsers, newestUser, newestActiveUser }) => {
    const { t } = useTranslation();
    const createdDate = newestUser?.createdDate;
    return (
        <>
            <Paragraph>
                {t("pages.dashboard.users.count")}: {numberOfUsers}
            </Paragraph>
            {newestUser && (
                <Paragraph>
                    {t("pages.dashboard.users.newest")}: {getNameOfUser(newestUser)}
                </Paragraph>
            )}
            {createdDate && (
                <Paragraph>
                    {t("pages.dashboard.users.newestcreated")}: {format(createdDate, t("common.dateformat"))}
                </Paragraph>
            )}
            <Paragraph>
                {t("pages.dashboard.users.activecount")}: {numberOfActiveUsers}
            </Paragraph>
            {newestActiveUser && (
                <Paragraph>
                    {t("pages.dashboard.users.newestactive")}: {getNameOfUser(newestActiveUser)}
                </Paragraph>
            )}
        </>
    );
};
export default Users;
