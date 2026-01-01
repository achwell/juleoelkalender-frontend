import { CalendarToken } from "@/types/generated";
import { zCalendarToken } from "@/types/generated/zod.gen";

const calendarTokenSchema = (t: (key: string, params?: {}) => string, tokens: CalendarToken[]) =>
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
            const cleanValue = token ? token.replace(/\s/g, "").toUpperCase() : "";
            const existingToken = tokens
                .filter((et) => et.token.replace(/\s/g, "").toUpperCase() === cleanValue)
                .filter((et) => et.id !== id)
                .at(0);
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
