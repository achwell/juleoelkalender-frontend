import BeerForm from "@/components/BeerForm";
import FullScreenLoader from "@/components/FullScreenLoader";
import H1 from "@/components/layout/H1";
import { useGetBeerQuery } from "@/redux/api/beerApi";
import { useGetBeerStylesQuery } from "@/redux/api/beerStyleApi";
import { setBeerStyles } from "@/redux/features/beerStylesSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Beer } from "@/types/generated";
import { hasAuthority } from "@/utils";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { v4 as uuidv4 } from "uuid";

const EditBeerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const [defaults] = useState(() => ({ id: uuidv4(), date: new Date() }));
  const beerId = id === "new" ? undefined : id;
  const { currentUser } = useAppSelector((state) => state.authState);
  const { data: beerStyles } = useGetBeerStylesQuery(undefined);
  const { data, isFetching } = useGetBeerQuery(beerId ?? "", { skip: !beerId });

  useEffect(() => {
    if (beerStyles) {
      dispatch(setBeerStyles(beerStyles.map((b) => b.name)));
    }
  }, [beerStyles, dispatch]);

  const canEdit =
    !!currentUser &&
    !!data &&
    hasAuthority(currentUser, "beer:update") &&
    (data.brewer.id === currentUser.id || hasAuthority(currentUser, "beer:update_other"));
  const beer: Beer | undefined =
    id === "new" && currentUser
      ? {
          id: defaults.id,
          name: "",
          style: "",
          description: "",
          abv: 0,
          ibu: 0,
          ebc: 0,
          recipe: "",
          untapped: "",
          brewer: { ...currentUser, createdDate: currentUser.createdDate ?? defaults.date },
          reviews: [],
          archived: false,
          brewedDate: defaults.date,
          bottleDate: defaults.date,
          createdDate: defaults.date,
          desiredDate: undefined,
        }
      : canEdit
        ? data
        : undefined;
  useEffect(() => {
    if (data && currentUser && !isFetching && !canEdit) navigate(from ?? "/beers");
  }, [data, currentUser, isFetching, canEdit, navigate, from]);

  if (!currentUser || !beer) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <H1>{beer.id ? t("pages.beeredit.editbeer") : t("pages.beeredit.addbeer")}</H1>
      <BeerForm beer={beer} user={currentUser} from={from} isNew={id === "new"} />
    </>
  );
};

export default EditBeerPage;
