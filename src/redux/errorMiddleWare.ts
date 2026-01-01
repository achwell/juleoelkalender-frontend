import { isRejectedWithValue, type Middleware, type MiddlewareAPI } from "@reduxjs/toolkit";

/**
 * Log a warning and show a toast!
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const rtkQueryErrorLogger: Middleware = (_api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const { payload, error, meta } = action;
        const { message } = error;
        // @ts-ignore
        const { status, data } = payload;
        // @ts-ignore
        const { baseQueryMeta } = meta;
        const { request, response } = baseQueryMeta;
        const headers = response.headers;
        console.log({ action, status, data, message, request, response, headers });
        const content = data || message;
        console.warn(content);
        if (status && status === 401) {
            window.location.hash = "/logout";
        }
    }

    return next(action);
};
