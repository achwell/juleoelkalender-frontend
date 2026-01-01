import { zReviewWithoutChildren } from "@/types/generated/zod.gen";
import { z } from "zod";

const reviewWithoutChildrenSchema = (t: (key: string, params?: {}) => string) =>
    zReviewWithoutChildren
        .omit({
            createdAt: true,
            ratingLabel: true,
            ratingLooks: true,
            ratingSmell: true,
            ratingTaste: true,
            ratingFeel: true,
            ratingOverall: true,
        })
        .extend({
            createdAt: z.coerce
                .date()
                .min(new Date("1900-01-01"), { error: t("validation.required", { field: t("review.createdAt") }) }),
            ratingLabel: z.preprocess(
                (val) => Number(val),
                z
                    .number()
                    .int()
                    .positive(t("validation.positive"))
                    .max(5, { error: t("validation.maxvalue", { field: t("rating.label"), number: 5 }) })
            ),
            ratingLooks: z.preprocess(
                (val) => Number(val),
                z
                    .number()
                    .positive(t("validation.positive"))
                    .max(3, { error: t("validation.maxvalue", { field: t("rating.looks"), number: 3 }) })
            ),
            ratingTaste: z.preprocess(
                (val) => Number(val),
                z
                    .number()
                    .positive(t("validation.positive"))
                    .max(20, { error: t("validation.maxvalue", { field: t("rating.taste"), number: 20 }) })
            ),
            ratingSmell: z.preprocess(
                (val) => Number(val),
                z
                    .number()
                    .positive(t("validation.positive"))
                    .max(12, { error: t("validation.maxvalue", { field: t("rating.smell"), number: 12 }) })
            ),
            ratingFeel: z.preprocess(
                (val) => Number(val),
                z
                    .number()
                    .positive(t("validation.positive"))
                    .max(5, { error: t("validation.maxvalue", { field: t("rating.feel"), number: 5 }) })
            ),
            ratingOverall: z.preprocess(
                (val) => Number(val),
                z
                    .number()
                    .positive(t("validation.positive"))
                    .max(10, { error: t("validation.maxvalue", { field: t("rating.overall"), number: 10 }) })
            ),
        });
export default reviewWithoutChildrenSchema;
