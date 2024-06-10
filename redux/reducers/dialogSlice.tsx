import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface dialogState {
  data: any;
}

const initialState: dialogState = {
  data: false,
};

export const tableSlice = createSlice({
  name: "dialogState",
  initialState,
  reducers: {
    setdialogState: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { setdialogState } = tableSlice.actions;

export default tableSlice.reducer;
