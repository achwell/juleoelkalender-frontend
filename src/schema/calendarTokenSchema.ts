import { CalendarToken } from "@/types/generated";
import { zCalendarToken } from "@/types/generated/zod.gen";
import TextFunction from "@/types/TextFunction";

const calendarTokenSchema = (t: TextFunction, tokens: CalendarToken[]) =>
  zCalendarToken.check((ctx) => {
    const { id, name, token } = ctx.value;
    if (!name || name.trim().length === 0) {
      ctx.issues.push({
        path: ["name"],
        code: "custom",
        message: t("validation.required", { field: t("pages.tokens.name") }),
        input: ctx.value,
      });
    } else {
      const cleanValue = token ? token.replaceAll(/\s/g, "").toUpperCase() : "";
      const existingToken = tokens
        .filter((et) => et.token.replaceAll(/\s/g, "").toUpperCase() === cleanValue)
        .find((et) => et.id !== id);
      if (existingToken) {
        ctx.issues.push({
          path: ["name"],
          code: "custom",
          message: t("pages.tokens.tokenmustbeunique"),
          input: ctx.value,
        });
      }
    }
  });
export default calendarTokenSchema;
