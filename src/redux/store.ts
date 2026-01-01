import { actuatorApi } from "@/redux/api/actuatorApi";
import { authApi } from "@/redux/api/authApi";
import { beerApi } from "@/redux/api/beerApi";
import { beerCalendarApi } from "@/redux/api/beerCalendarApi";
import { beerStyleApi } from "@/redux/api/beerStyleApi";
import { calendarApi } from "@/redux/api/calendarApi";
import { calendarTokenApi } from "@/redux/api/calendarTokenApi";
import { dashboardApi } from "@/redux/api/dashboardApi";
import { logApi } from "@/redux/api/logApi";
import { passwordChangeRequestApi } from "@/redux/api/passwordChangeRequestApi";
import { refreshApi } from "@/redux/api/refreshApi";
import { reviewApi } from "@/redux/api/reviewApi";
import { userApi } from "@/redux/api/userApi";
import { rtkQueryErrorLogger } from "@/redux/errorMiddleWare";
import authReducer from "@/redux/features/authSlice";
import beerStylesReducer from "@/redux/features/beerStylesSlice";
import calendarTokenReducer from "@/redux/features/calendarTokenSlice";
import dashboardReducer from "@/redux/features/dashboardSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const persistConfig = {
    key: "auth",
    storage: storageSession,
};
const persistConfigBeerStyle = {
    key: "beerStyle",
    storage: storageSession,
};
const persistConfigCalendarToken = {
    key: "calendarToken",
    storage: storageSession,
};

const rootReducer = combineReducers({
    [actuatorApi.reducerPath]: actuatorApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [beerApi.reducerPath]: beerApi.reducer,
    [beerCalendarApi.reducerPath]: beerCalendarApi.reducer,
    [beerStyleApi.reducerPath]: beerStyleApi.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
    [calendarTokenApi.reducerPath]: calendarTokenApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [logApi.reducerPath]: logApi.reducer,
    [passwordChangeRequestApi.reducerPath]: passwordChangeRequestApi.reducer,
    [refreshApi.reducerPath]: refreshApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    authState: persistReducer(persistConfig, authReducer),
    beerStylesState: persistReducer(persistConfigBeerStyle, beerStylesReducer),
    calendarTokenState: persistReducer(persistConfigCalendarToken, calendarTokenReducer),
    dashboardState: dashboardReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: import.meta.env.DEV,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: [
                    actuatorApi.middleware,
                    authApi.middleware,
                    beerApi.middleware,
                    beerCalendarApi.middleware,
                    beerStyleApi.middleware,
                    calendarApi.middleware,
                    calendarTokenApi.middleware,
                    dashboardApi.middleware,
                    logApi.middleware,
                    passwordChangeRequestApi.middleware,
                    refreshApi.middleware,
                    reviewApi.middleware,
                    userApi.middleware,
                ],
            },
            serializableCheck: false,
            immutableCheck: false,
        }).concat([
            rtkQueryErrorLogger,
            actuatorApi.middleware,
            authApi.middleware,
            beerApi.middleware,
            beerCalendarApi.middleware,
            beerStyleApi.middleware,
            calendarApi.middleware,
            calendarTokenApi.middleware,
            dashboardApi.middleware,
            logApi.middleware,
            passwordChangeRequestApi.middleware,
            refreshApi.middleware,
            reviewApi.middleware,
            userApi.middleware,
        ]),
});
setupListeners(store.dispatch);
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
