const register = async () => {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const checkForUpdate = () => {
      if (navigator.onLine) {
        void registration.update().catch((error) => console.warn("PWA update check failed", error));
      }
    };
    checkForUpdate();
    window.setInterval(checkForUpdate, 60 * 60 * 1000);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkForUpdate();
    });
  } catch (error) {
    console.warn("Service worker registration failed", error);
  }
};
export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  if (document.readyState === "complete") void register();
  else window.addEventListener("load", () => void register(), { once: true });
}
