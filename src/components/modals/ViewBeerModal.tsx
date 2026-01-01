import ActionKnapper from "@/components/ActionKnapper";
import ModalDialog from "@/components/ModalDialog";
import BeerDetails from "@/types/BeerDetails";
import { ButtonType } from "@/types/ButtonProps";
import { format } from "date-fns-tz";
import { useTranslation } from "react-i18next";

interface Props {
    beerDetails?: BeerDetails;
    show: boolean;
    hide: () => void;
}

const ViewBeerModal = ({ beerDetails, show, hide }: Props) => {
    const { t } = useTranslation();
    if (!beerDetails) {
        return null;
    }
    const {
        beer: {
            name,
            style,
            description,
            abv,
            ebc,
            ibu,
            brewedDate,
            bottleDate,
            brewer: { firstName, middleName, lastName },
        },
        day,
    } = beerDetails;

    return (
        <ModalDialog show={show} hide={hide} title={name}>
            <div id="modal-modal-description" className="mt-2 text-base">
                <table>
                    <tbody>
                        <tr>
                            <td className="w-24 pr-6">{t("pages.calendarview.beer.day")}</td>
                            <td>{day}</td>
                        </tr>
                        <tr>
                            <td className="w-24 pr-6">{t("beer.style")}</td>
                            <td>{style}</td>
                        </tr>
                        <tr>
                            <td className="w-24 pr-6">{t("beer.description")}</td>
                            <td>{description}</td>
                        </tr>
                        <tr>
                            <td className="w-24 pr-6">{t("beer.abv")}</td>
                            <td>{abv}</td>
                        </tr>
                        <tr>
                            <td className="w-24 pr-6">{t("beer.ebc")}</td>
                            <td>{ebc}</td>
                        </tr>
                        <tr>
                            <td className="w-24 pr-6">{t("beer.ibu")}</td>
                            <td>{ibu}</td>
                        </tr>
                        {brewedDate && (
                            <tr>
                                <td className="w-24 pr-6">{t("beer.breweddate")}</td>
                                <td>{format(brewedDate, t("common.dateformat"))}</td>
                            </tr>
                        )}
                        {bottleDate && (
                            <tr>
                                <td className="w-24 pr-6">{t("beer.bottledate")}</td>
                                <td>{format(bottleDate, t("common.dateformat"))}</td>
                            </tr>
                        )}
                        <tr>
                            <td className="w-24 pr-6">{t("beer.brewer")}</td>
                            <td>{[firstName, middleName, lastName].filter((s) => !!s).join(" ")}</td>
                        </tr>
                    </tbody>
                </table>
                <ActionKnapper buttons={[{ text: t("buttons.ok"), icon: ButtonType.CANCEL, onClick: hide }]} />
            </div>
        </ModalDialog>
    );
};
export default ViewBeerModal;
