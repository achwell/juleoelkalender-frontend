import { zRegisterRequest } from "@/types/generated/zod.gen";
import { z } from "zod";

const registerInputSchema = (t: (key: string, params?: {}) => string) =>
    zRegisterRequest
        .omit({ email: true })
        .extend({
            email: z
                .email({ error: t("validation.invalid", { field: t("pages.register.email") }) })
                .min(1, { error: t("validation.required", { field: t("pages.register.email") }) }),
            confirmPassword: z
                .string()
                .min(1, { error: t("validation.required", { field: t("pages.register.confirmpassword") }) })
                .min(8, {
                    error: t("validation.mincharacters", { field: t("pages.register.confirmpassword"), number: 8 }),
                })
                .max(32, {
                    error: t("validation.maxcharacters", { field: t("pages.register.confirmpassword"), number: 32 }),
                }),
            showPassword: z.boolean(),
        })
        .check((ctx) => {
            const { calendarToken, confirmPassword, firstName, lastName, middleName, password } = ctx.value;
            if (!calendarToken || calendarToken.trim().length === 0) {
                ctx.issues.push({
                    path: ["calendarToken"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.register.token") }),
                    input: ctx.value,
                });
            } else if (calendarToken.trim().length > 100) {
                ctx.issues.push({
                    path: ["calendarToken"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.register.token"), number: 100 }),
                    input: ctx.value,
                });
            }
            if (!firstName || firstName.trim().length === 0) {
                ctx.issues.push({
                    path: ["firstName"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.register.firstName") }),
                    input: ctx.value,
                });
            } else if (firstName.trim().length > 255) {
                ctx.issues.push({
                    path: ["firstName"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.register.firstName"), number: 255 }),
                    input: ctx.value,
                });
            }
            if (!lastName || lastName.trim().length === 0) {
                ctx.issues.push({
                    path: ["lastName"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.register.lastName") }),
                    input: ctx.value,
                });
            } else if (lastName.trim().length > 255) {
                ctx.issues.push({
                    path: ["lastName"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.register.lastName"), number: 255 }),
                    input: ctx.value,
                });
            }
            if (!(!middleName || middleName.trim().length === 0) && middleName.trim().length > 255) {
                ctx.issues.push({
                    path: ["middleName"],
                    code: "custom",
                    message: t("validation.maxcharacters", {
                        field: t("pages.register.middleName"),
                        number: 255,
                    }),
                    input: ctx.value,
                });
            }
            if (!password || password.trim().length === 0) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.register.password") }),
                    input: ctx.value,
                });
            } else if (!password || password.trim().length < 8) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.mincharacters", { field: t("pages.register.password"), number: 8 }),
                    input: ctx.value,
                });
            } else if (password.trim().length > 32) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.register.password"), number: 32 }),
                    input: ctx.value,
                });
            }
            if (password !== confirmPassword) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.passwordsdontmatch"),
                    input: ctx.value,
                });
                ctx.issues.push({
                    path: ["confirmPassword"],
                    code: "custom",
                    message: t("validation.passwordsdontmatch"),
                    input: ctx.value,
                });
            }
        });
export default registerInputSchema;
