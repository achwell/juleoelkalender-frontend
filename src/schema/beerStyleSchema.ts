import { BeerStyle } from "@/types/generated";
import { zBeerStyle } from "@/types/generated/zod.gen";
import TextFunction from "@/types/TextFunction";

const beerStyleSchema = (t: TextFunction, beerStyles: BeerStyle[]) =>
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
      const cleanValue = name ? name.replaceAll(/\s/g, "").toUpperCase() : "";
      const existingToken = beerStyles
        .filter((et) => et.name.replaceAll(/\s/g, "").toUpperCase() === cleanValue)
        .find((et) => et.id !== id);
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
