import { Beer, Calendar } from "@/types/generated";
import { zBeerCalendar } from "@/types/generated/zod.gen";
import TextFunction from "@/types/TextFunction";
import { z } from "zod";

const beerCalendarSchema = (t: TextFunction, occupiedDays: number[]) =>
  zBeerCalendar
    .omit({ id: true, day: true, beer: true, calendar: true })
    .extend({
      id: z.string().optional(),
      beer: z.custom<Beer>(),
      calendar: z.custom<Calendar>(),
      day: z.coerce
        .number()
        .min(1, {
          error: t("validation.minvalue", { field: t("pages.calendar.admin.addbeermodal.day"), number: 1 }),
        })
        .max(24, {
          error: t("validation.maxvalue", { field: t("pages.calendar.admin.addbeermodal.day"), number: 24 }),
        }),
    })
    .check((ctx) => {
      const { day } = ctx.value;
      if (occupiedDays.includes(day)) {
        ctx.issues.push({
          path: ["day"],
          code: "custom",
          message: t("pages.calendar.admin.addbeermodal.itsalreadyabeeronthisday"),
          input: ctx.value,
        });
      }
    });
export default beerCalendarSchema;
