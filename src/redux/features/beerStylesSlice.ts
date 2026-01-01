import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface BeerStylesState {
    beerStyles: string[];
}

const initialState: BeerStylesState = {
    beerStyles: [],
};

export const beerStylesSlice = createSlice({
    name: "beerStyles",
    initialState,
    reducers: {
        setBeerStyles: (state: BeerStylesState, action: PayloadAction<string[]>) => {
            state.beerStyles = action.payload;
        },
    },
});
export const { setBeerStyles } = beerStylesSlice.actions;
export default beerStylesSlice.reducer;
