import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface nextState {
  data: any;
}

const initialState: nextState = {
  data: false,
};

export const nextSlice = createSlice({
  name: "nextState",
  initialState,
  reducers: {
    setnextState: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { setnextState } = nextSlice.actions;

export default nextSlice.reducer;
