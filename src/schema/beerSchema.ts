import reviewWithoutChildrenSchema from "@/schema/reviewWithoutChildrenSchema";
import { zBeer } from "@/types/generated/zod.gen";
import { z } from "zod";

const beerSchema = (t: (key: string, params?: {}) => string) =>
    zBeer
        .omit({
            bottleDate: true,
            brewedDate: true,
            createdDate: true,
            reviews: true,
            abv: true,
            ibu: true,
            ebc: true,
            desiredDate: true,
        })
        .extend({
            bottleDate: z.coerce
                .date()
                .min(new Date("1900-01-01"), { error: t("validation.required", { field: t("beer.bottledate") }) }),
            brewedDate: z.coerce
                .date()
                .min(new Date("1900-01-01"), { error: t("validation.required", { field: t("beer.breweddate") }) }),
            createdDate: z.coerce
                .date()
                .min(new Date("1900-01-01"), { error: t("validation.required", { field: t("beer.createdDate") }) }),
            abv: z.preprocess(
                (val) => Number(val),
                z.number().positive(t("validation.minvalue", { field: t("beer.abv"), number: 0.1 }))
            ),
            ibu: z.preprocess(
                (val) => Number(val),
                z.number().positive(t("validation.minvalue", { field: t("beer.ibu"), number: 0.1 }))
            ),
            ebc: z.preprocess(
                (val) => Number(val),
                z.number().positive(t("validation.minvalue", { field: t("beer.ebc"), number: 0.1 }))
            ),
            reviews: z.array(reviewWithoutChildrenSchema(t)),
            desiredDate: z.coerce
                .number()
                .int()
                .min(1, { message: t("validation.minvalue", { field: t("beer.desiredDate"), number: 1 }) })
                .max(24, { message: t("validation.maxvalue", { field: t("beer.desiredDate"), number: 24 }) })
                .optional(),
        })
        .check((ctx) => {
            const { name, style, description, abv, ibu, ebc } = ctx.value;
            if (!name || name.trim().length === 0) {
                ctx.issues.push({
                    path: ["name"],
                    code: "custom",
                    message: t("validation.required", { field: t("beer.name") }),
                    input: ctx.value,
                });
            }
            if (!style || style.trim().length === 0) {
                ctx.issues.push({
                    path: ["style"],
                    code: "custom",
                    message: t("validation.required", { field: t("beer.style") }),
                    input: ctx.value,
                });
            }
            if (!!description && description.trim().length > 255) {
                ctx.issues.push({
                    path: ["description"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("beer.description"), number: 255 }),
                    input: ctx.value,
                });
            }
            if (!abv) {
                ctx.issues.push({
                    path: ["abv"],
                    code: "custom",
                    message: t("validation.required", { field: t("beer.abv") }),
                    input: ctx.value,
                });
            } else if (abv > 100) {
                ctx.issues.push({
                    path: ["abv"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("beer.abv"), number: 100 }),
                    input: ctx.value,
                });
            }
            if (!ibu) {
                ctx.issues.push({
                    path: ["ibu"],
                    code: "custom",
                    message: t("validation.required", { field: t("beer.ibu") }),
                    input: ctx.value,
                });
            }
            if (!ebc) {
                ctx.issues.push({
                    path: ["ebc"],
                    code: "custom",
                    message: t("validation.required", { field: t("beer.ebc") }),
                    input: ctx.value,
                });
            }
        });
export default beerSchema;
