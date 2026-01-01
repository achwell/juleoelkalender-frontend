import BeerForm from "@/components/BeerForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import { useGetBeerQuery } from "@/redux/api/beerApi";
import { useGetBeerStylesQuery } from "@/redux/api/beerStyleApi";
import { setBeerStyles } from "@/redux/features/beerStylesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Beer } from "@/types/generated";
import { hasAuthority } from "@/utils";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router";

const EditBeerPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from");
    const [beerId, setBeerId] = useState<string>();
    const [beer, setBeer] = useState<Beer>();
    const { currentUser } = useAppSelector((state) => state.authState);
    const { data: beerStyles } = useGetBeerStylesQuery(undefined);
    const { data, isFetching } = useGetBeerQuery(beerId ?? "", { skip: !beerId });

    useEffect(() => {
        if (beerStyles) {
            dispatch(setBeerStyles(beerStyles.map((b) => b.name)));
        }
    }, [beerStyles]);

    useEffect(() => {
        if (currentUser) {
            if (id === "new") {
                setBeer({
                    id: uuidv4(),
                    name: "",
                    style: "",
                    description: "",
                    abv: 0,
                    ibu: 0,
                    ebc: 0,
                    recipe: "",
                    untapped: "",
                    brewer: { ...currentUser, createdDate: currentUser.createdDate ?? new Date() },
                    reviews: [],
                    archived: false,
                    brewedDate: new Date(),
                    bottleDate: new Date(),
                    createdDate: new Date(),
                    desiredDate: undefined,
                });
            } else {
                setBeerId(id);
            }
        }
    }, [id, currentUser]);

    useEffect(() => {
        if (!isFetching && !!data && !!currentUser && !!data.id) {
            if (
                hasAuthority(currentUser, "beer:update") &&
                (data.brewer.id === currentUser.id ||
                    (data.brewer.id !== currentUser.id && hasAuthority(currentUser, "beer:update_other")))
            ) {
                setBeer(data);
            } else {
                navigate(from ?? "/beers");
            }
        }
    }, [beerId, data, isFetching]);

    if (!currentUser || !beer) return <FullScreenLoader />;

    return (
        <>
            <H1>{beer.id ? t("pages.beeredit.editbeer") : t("pages.beeredit.addbeer")}</H1>
            <BeerForm beer={beer} user={currentUser} from={from} isNew={id === "new"} />
        </>
    );
};

export default EditBeerPage;
