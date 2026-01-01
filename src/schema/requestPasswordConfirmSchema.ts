import { z } from "zod";

const requestPasswordConfirmSchema = (t: (key: string, params?: {}) => string) =>
    z
        .object({
            email: z
                .email({ error: t("validation.invalid", { field: t("pages.forgottenpassword.email") }) })
                .min(1, { error: t("validation.required", { field: t("pages.forgottenpassword.email") }) }),
            password: z
                .string()
                .min(1, { error: t("validation.required", { field: t("pages.forgottenpassword.password") }) })
                .min(8, {
                    error: t("validation.mincharacters", { field: t("pages.forgottenpassword.password"), number: 8 }),
                })
                .max(32, {
                    error: t("validation.maxcharacters", { field: t("pages.forgottenpassword.password"), number: 32 }),
                }),
            confirmPassword: z
                .string()
                .min(1, { error: t("validation.required", { field: t("pages.forgottenpassword.confirmpassword") }) })
                .min(8, {
                    error: t("validation.mincharacters", {
                        field: t("pages.forgottenpassword.confirmpassword"),
                        number: 8,
                    }),
                })
                .max(32, {
                    error: t("validation.maxcharacters", {
                        field: t("pages.forgottenpassword.confirmpassword"),
                        number: 32,
                    }),
                }),
            token: z
                .string()
                .min(1, { error: t("validation.required", { field: t("pages.forgottenpassword.token") }) }),
            showPassword: z.boolean(),
        })
        .check((ctx) => {
            const { password, confirmPassword } = ctx.value;
            if (password !== confirmPassword) {
                ctx.issues.push({
                    path: ["password"],
                    code: "custom",
                    message: t("pages.forgottenpassword.passwordsdontmatch"),
                    input: ctx.value,
                });
                ctx.issues.push({
                    path: ["confirmPassword"],
                    code: "custom",
                    message: t("pages.forgottenpassword.passwordsdontmatch"),
                    input: ctx.value,
                });
            }
        });
export default requestPasswordConfirmSchema;
