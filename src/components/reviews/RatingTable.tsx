import { Review } from "@/types/generated";
import { FC } from "react";
import { useTranslation } from "react-i18next";

const RatingTable: FC<{
    average: Partial<Review>;
    averageMyBeer: Partial<Review>;
}> = ({ average, averageMyBeer }) => {
    const { t } = useTranslation();
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th></th>
                    <th>{t("ratingtable.average.yourbeer")}</th>
                    <th>{t("ratingtable.average.calendar")}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{t("rating.taste")}</td>
                    <td>{averageMyBeer.ratingTaste}</td>
                    <td>{average.ratingTaste?.toFixed(1)}</td>
                </tr>
                <tr>
                    <td>{t("rating.feel")}</td>
                    <td>{averageMyBeer.ratingFeel}</td>
                    <td>{average.ratingFeel?.toFixed(1)}</td>
                </tr>
                <tr>
                    <td>{t("rating.smell")}</td>
                    <td>{averageMyBeer.ratingSmell}</td>
                    <td>{average.ratingSmell?.toFixed(1)}</td>
                </tr>
                <tr>
                    <td>{t("rating.label")}</td>
                    <td>{averageMyBeer.ratingLabel}</td>
                    <td>{average.ratingLabel?.toFixed(1)}</td>
                </tr>
                <tr>
                    <td>{t("rating.looks")}</td>
                    <td>{averageMyBeer.ratingLooks}</td>
                    <td>{average.ratingLooks?.toFixed(1)}</td>
                </tr>
                <tr>
                    <td>{t("rating.overall")}</td>
                    <td>{averageMyBeer.ratingOverall}</td>
                    <td>{average.ratingOverall?.toFixed(1)}</td>
                </tr>
            </tbody>
        </table>
    );
};
export default RatingTable;
