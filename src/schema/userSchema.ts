import { NameEnum, User } from "@/types/generated";
import { zUserWithoutChildren } from "@/types/generated/zod.gen";
import { z } from "zod";

const userSchema = (t: (key: string, params?: {}) => string, allUsers: User[]) =>
    zUserWithoutChildren
        .omit({
            id: true,
            email: true,
            lastLoginDate: true,
            createdDate: true,
            facebookUserId: true,
            imageUrl: true,
            imageHeight: true,
            imageWidth: true,
            imageSilhouette: true,
            role: true,
            calendarToken: true,
            middleName: true,
            area: true,
        })
        .extend({
            id: z.uuid().optional(),
            confirmPassword: z.string().min(1, {
                error: t("validation.required", {
                    field: t("pages.user.confirmpassword"),
                }),
            }),
            email: z.email({ error: t("validation.invalid", { field: t("pages.user.email") }) }).min(1, {
                error: t("validation.required", {
                    field: t("pages.user.email"),
                }),
            }),
            showPassword: z.boolean(),
            roleName: z.enum(NameEnum, {
                error: t("validation.required", {
                    field: t("pages.user.role"),
                }),
            }),
            token: z.string().min(1, {
                error: t("validation.required", {
                    field: t("pages.user.token"),
                }),
            }),
            middleName: z
                .string()
                .max(255, { error: t("validation.maxcharacters", { field: t("pages.user.middleName"), number: 255 }) })
                .optional(),
            area: z
                .string()
                .max(255, { error: t("validation.maxcharacters", { field: t("pages.user.area"), number: 255 }) })
                .optional(),
        })
        .check((ctx) => {
            const { area, confirmPassword, email, firstName, id, lastName, middleName, password, roleName } = ctx.value;
            if (!firstName || firstName.trim().length === 0) {
                ctx.issues.push({
                    path: ["firstName"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.user.firstName") }),
                    input: ctx.value,
                });
            } else if (firstName.trim().length > 255) {
                ctx.issues.push({
                    path: ["firstName"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.user.firstName"), number: 255 }),
                    input: ctx.value,
                });
            }
            if (!(!middleName || middleName.trim().length === 0 || middleName.trim().length <= 255)) {
                ctx.issues.push({
                    path: ["middleName"],
                    code: "custom",
                    message: t("validation.maxcharacters", {
                        field: t("pages.user.middleName"),
                        number: 255,
                    }),
                    input: ctx.value,
                });
            }
            if (!lastName || lastName.trim().length === 0) {
                ctx.issues.push({
                    path: ["lastName"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.user.lastName") }),
                    input: ctx.value,
                });
            } else if (lastName.trim().length > 255) {
                ctx.issues.push({
                    path: ["lastName"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.user.lastName"), number: 255 }),
                    input: ctx.value,
                });
            }
            if (allUsers.filter((u) => u.id !== id && u.email === email).length > 1) {
                ctx.issues.push({
                    path: ["email"],
                    code: "custom",
                    message: t("pages.user.emailinuse"),
                    input: ctx.value,
                });
            }
            if (!password || password.trim().length === 0) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.required", { field: t("pages.user.password") }),
                    input: ctx.value,
                });
            } else if (password.trim().length < 8) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.user.password"), number: 8 }),
                    input: ctx.value,
                });
            } else if (password.trim().length > 32) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("validation.maxcharacters", { field: t("pages.user.password"), number: 32 }),
                    input: ctx.value,
                });
            }

            if (password !== confirmPassword) {
                ctx.issues.push({
                    path: ["confirmPassword"],
                    code: "custom",
                    message: t("validation.passwordsdontmatch"),
                    input: ctx.value,
                });
            }
            if (!(!area || area.trim().length === 0 || area.trim().length <= 255)) {
                ctx.issues.push({
                    path: ["area"],
                    code: "custom",
                    message: t("validation.maxcharacters", {
                        field: t("pages.user.area"),
                        number: 255,
                    }),
                    input: ctx.value,
                });
            }
            if (!roleName) {
                ctx.issues.push({
                    path: ["area"],
                    code: "custom",
                    message: t("validation.required", {
                        field: t("pages.user.role"),
                    }),
                    input: ctx.value,
                });
            }
        });
export default userSchema;
