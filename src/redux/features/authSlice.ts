import { User } from "@/types/generated";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
    currentUser: User | null;
    token: string | null;
}

const initialState: AuthState = {
    currentUser: null,
    token: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCurrentUser: (state: AuthState, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload;
        },
        setToken: (state: AuthState, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
    },
});
export const { setCurrentUser, setToken } = authSlice.actions;
export default authSlice.reducer;
