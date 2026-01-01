type Environment = "prod" | "local";

interface EnvironmentConfig {
    environment: Environment;
    BASE_URL: string;
    SUPPORT_EMAIL: string;
    FB_APP_ID: string | undefined;
    GOOGLE_CLIENT_ID: string | undefined;
}
const environmentConfigs: EnvironmentConfig[] = [
    {
        environment: "local",
        BASE_URL: "http://localhost:8080",
        SUPPORT_EMAIL: "axelwulff@mac.com",
        FB_APP_ID: undefined,
        GOOGLE_CLIENT_ID: undefined,
    },
    {
        environment: "prod",
        BASE_URL: "https://juleoelkalender.no",
        SUPPORT_EMAIL: "admin@juleoelkalender.no",
        FB_APP_ID: "5400209263406320",
        GOOGLE_CLIENT_ID: "514170480151-gcgbu7iudefecq9dmidd4es1ubc3njqs.apps.googleusercontent.com",
    },
];
export const getEnvironment = (): Environment => {
    const isLocal = window.location.href.includes("localhost");
    const isProduction = !isLocal && window.location.href.includes("juleoelkalender.no");

    if (isProduction) {
        return "prod";
    }

    return "local";
};
const getUrlsForEnvironment = (environment: Environment): EnvironmentConfig | undefined => {
    return environmentConfigs.find((env) => env.environment === environment);
};

const currentEnvironment = getEnvironment();
const urls = getUrlsForEnvironment(currentEnvironment);
if (!urls) {
    console.error("No URLs found for the current environment");
}
export const BASE_URL = urls!.BASE_URL;
export const SUPPORT_EMAIL = urls!.SUPPORT_EMAIL;
export const FB_APP_ID = urls!.FB_APP_ID;
export const GOOGLE_CLIENT_ID = urls!.GOOGLE_CLIENT_ID;
