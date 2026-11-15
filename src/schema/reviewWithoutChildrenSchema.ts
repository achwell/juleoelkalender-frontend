import { zReviewWithoutChildren } from "@/types/generated/zod.gen";
import TextFunction from "@/types/TextFunction";
import { z } from "zod";

const reviewWithoutChildrenSchema = (t: TextFunction) =>
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
        (value) => Number(value),
        z
          .number()
          .int()
          .positive(t("validation.positive"))
          .max(5, { error: t("validation.maxvalue", { field: t("rating.label"), number: 5 }) }),
      ),
      ratingLooks: z.preprocess(
        (value) => Number(value),
        z
          .number()
          .positive(t("validation.positive"))
          .max(3, { error: t("validation.maxvalue", { field: t("rating.looks"), number: 3 }) }),
      ),
      ratingTaste: z.preprocess(
        (value) => Number(value),
        z
          .number()
          .positive(t("validation.positive"))
          .max(20, { error: t("validation.maxvalue", { field: t("rating.taste"), number: 20 }) }),
      ),
      ratingSmell: z.preprocess(
        (value) => Number(value),
        z
          .number()
          .positive(t("validation.positive"))
          .max(12, { error: t("validation.maxvalue", { field: t("rating.smell"), number: 12 }) }),
      ),
      ratingFeel: z.preprocess(
        (value) => Number(value),
        z
          .number()
          .positive(t("validation.positive"))
          .max(5, { error: t("validation.maxvalue", { field: t("rating.feel"), number: 5 }) }),
      ),
      ratingOverall: z.preprocess(
        (value) => Number(value),
        z
          .number()
          .positive(t("validation.positive"))
          .max(10, { error: t("validation.maxvalue", { field: t("rating.overall"), number: 10 }) }),
      ),
    });
export default reviewWithoutChildrenSchema;
