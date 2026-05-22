import calendarTokenSchema from "@/schema/calendarTokenSchema";
import CalendarId from "@/types/CalendarId";
import { zCalendar } from "@/types/generated/zod.gen";
import TextFunction from "@/types/TextFunction";
import { z } from "zod";

const calendarSchema = (t: TextFunction, calendars: CalendarId[]) =>
  zCalendar
    .omit({ id: true, calendarToken: true, year: true })
    .extend({
      id: z.string().optional(),
      calendarToken: calendarTokenSchema(t, []),
      year: z.preprocess(
        Number,
        z.number().positive(
          t("validation.required", {
            field: t("calendarform.year"),
          }),
        ),
      ),
    })
    .check((ctx) => {
      const { id, name, year } = ctx.value;
      const existingCalendar = calendars
        .filter((ec) => ec.year === year)
        .filter((ec) => ec.id !== id)
        .some((ec) => ec.name === name);
      if (!name || name.trim().length === 0) {
        ctx.issues.push({
          path: ["name"],
          code: "custom",
          message: t("validation.required", { field: t("calendarform.name") }),
          input: ctx.value,
        });
      }
      if (existingCalendar) {
        ctx.issues.push(
          {
            path: ["name"],
            code: "custom",
            message: t("calendarform.combinationExists"),
            input: ctx.value,
          },
          {
            path: ["year"],
            code: "custom",
            message: t("calendarform.combinationExists"),
            input: ctx.value,
          },
        );
      }
    });
export default calendarSchema;
