import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import MyBeersTable from "@/components/tables/MyBeersTable";
import { useAppSelector } from "@/redux/hooks";
import { ButtonType } from "@/types/ButtonProps";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const BeerPage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAppSelector((state) => state.authState);
    const { t } = useTranslation();

    if (!currentUser) return <FullScreenLoader />;

    return (
        <>
            <H1>{t("pages.beers.header")}</H1>
            <MyBeersTable
                beers={currentUser.beers ?? []}
                page="/beers"
                buttons={[
                    {
                        text: t("pages.beers.addbeer"),
                        variant: "contained",
                        icon: ButtonType.NEW,
                        onClick: () => navigate("/beers/edit/new"),
                    },
                ]}
            />
        </>
    );
};

export default BeerPage;
