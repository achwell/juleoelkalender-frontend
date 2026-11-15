import { baseApi } from "@/redux/api/baseApi";
import { rtkQueryErrorLogger } from "@/redux/errorMiddleWare";
import authReducer from "@/redux/features/authSlice";
import beerStylesReducer from "@/redux/features/beerStylesSlice";
import calendarTokenReducer from "@/redux/features/calendarTokenSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/es/storage/session";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  authState: persistReducer({ key: "auth", storage: storageSession }, authReducer),
  beerStylesState: persistReducer({ key: "beerStyle", storage: storageSession }, beerStylesReducer),
  calendarTokenState: persistReducer({ key: "calendarToken", storage: storageSession }, calendarTokenReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(rtkQueryErrorLogger, baseApi.middleware),
});
setupListeners(store.dispatch);
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
