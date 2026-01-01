import App from "@/App";
import ErrorFallback from "@/components/ErrorFallback";
import { persistor, store } from "@/redux/store";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n";
import "@/style/index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => console.error({ error })}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <App />
                </PersistGate>
            </Provider>
        </ErrorBoundary>
    </StrictMode>
);
