import { zBeerCalendar } from "@/types/generated/zod.gen";
import { z } from "zod";

const beerCalendarSchema = (t: (key: string, params?: {}) => string, occupiedDays: number[]) =>
    zBeerCalendar
        .omit({ id: true, day: true })
        .extend({
            id: z.string().optional(),
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
                    path: ["name"],
                    code: "custom",
                    message: t("pages.calendar.admin.addbeermodal.itsalreadyabeeronthisday"),
                    input: ctx.value,
                });
            }
        });
export default beerCalendarSchema;
