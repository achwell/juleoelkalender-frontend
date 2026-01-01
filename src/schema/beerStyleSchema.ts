import { BeerStyle } from "@/types/generated";
import { zBeerStyle } from "@/types/generated/zod.gen";

const beerStyleSchema = (t: (key: string, params?: {}) => string, beerStyles: BeerStyle[]) =>
    zBeerStyle.check((ctx) => {
        const { id, name } = ctx.value;
        if (!name || name.trim().length === 0) {
            ctx.issues.push({
                path: ["name"],
                code: "custom",
                message: t("validation.required", { field: t("pages.beerstyles.beerstyle") }),
                input: ctx.value,
            });
        } else {
            const cleanValue = name ? name.replace(/\s/g, "").toUpperCase() : "";
            const existingToken = beerStyles
                .filter((et) => et.name.replace(/\s/g, "").toUpperCase() === cleanValue)
                .filter((et) => et.id !== id)
                .at(0);
            if (existingToken) {
                ctx.issues.push({
                    path: ["name"],
                    code: "custom",
                    message: t("pages.beerstyles.beerstylemustbeunique"),
                    input: ctx.value,
                });
            }
        }
    });
export default beerStyleSchema;
