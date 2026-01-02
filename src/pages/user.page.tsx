import FullScreenLoader from "@/components/FullScreenLoader";
import UserForm from "@/components/UserForm";
import H1 from "@/components/layout/H1";
import MyBeersTable from "@/components/tables/MyBeersTable";
import MyCalendarsTable from "@/components/tables/MyCalendarsTable";
import TabBox from "@/components/tabs/TabBox";
import { setCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { User } from "@/types/generated";
import { refreshData } from "@/utils";
import { useTranslation } from "react-i18next";

const UserPage = () => {
    const { t } = useTranslation();
    const { currentUser } = useAppSelector((state) => state.authState);
    const dispatch = useAppDispatch();

    const saveCallback = async (updatedUser: User) => {
        if (currentUser && currentUser.id === updatedUser.id) {
            dispatch(
                setCurrentUser({
                    ...currentUser,
                    ...updatedUser,
                })
            );
        }
        refreshData();
    };

    if (!currentUser) return <FullScreenLoader />;

    return (
        <>
            <H1>{t("pages.user.header")}</H1>

            <TabBox
                title={t("pages.user.header")}
                tabs={[
                    {
                        label: t("pages.user.tab.userdata"),
                        children: <UserForm user={currentUser} saveCallback={saveCallback} from="/user" />,
                    },
                    {
                        label: t("pages.user.tab.mybeers"),
                        hidden: currentUser.beers.length < 1,
                        children: <MyBeersTable beers={currentUser.beers} page="/user" />,
                    },
                    {
                        label: t("pages.user.tab.mycalendars"),
                        hidden: currentUser.beers.length < 1,
                        children: <MyCalendarsTable />,
                    },
                ]}
            />
        </>
    );
};

export default UserPage;
