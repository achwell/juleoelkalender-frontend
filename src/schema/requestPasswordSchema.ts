import { z } from "zod";

const requestPasswordSchema = (t: (key: string, params?: {}) => string) =>
    z.object({
        email: z
            .email({ error: t("validation.invalid", { field: t("pages.forgottenpassword.email") }) })
            .min(1, { error: t("validation.required", { field: t("pages.forgottenpassword.email") }) }),
        token: z.string().min(1, { error: t("validation.required", { field: t("pages.forgottenpassword.token") }) }),
    });
export default requestPasswordSchema;
