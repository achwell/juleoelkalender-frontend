import { z } from "zod";

const addTokenSchema = (t: (key: string, params?: {}) => string) =>
    z.object({
        email: z
            .email({ error: t("validation.invalid", { field: t("pages.addtoken.email") }) })
            .min(1, { error: t("validation.required", { field: t("pages.addtoken.email") }) }),
        token: z.string().min(1, { error: t("validation.required", { field: t("pages.addtoken.token") }) }),
    });
export default addTokenSchema;
