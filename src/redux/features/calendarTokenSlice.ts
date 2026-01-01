import { CalendarToken } from "@/types/generated";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CalendarTokenState {
    currentCalendarToken: CalendarToken | null;
}

const initialState: CalendarTokenState = {
    currentCalendarToken: null,
};
export const calendarTokenSlice = createSlice({
    name: "calendarToken",
    initialState,
    reducers: {
        setCurrentCalendarToken: (state: CalendarTokenState, action: PayloadAction<CalendarToken | null>) => {
            state.currentCalendarToken = action.payload;
        },
    },
});
export const { setCurrentCalendarToken } = calendarTokenSlice.actions;
export default calendarTokenSlice.reducer;
