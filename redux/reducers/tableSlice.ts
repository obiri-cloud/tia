import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TableState {
  data: any;
  total:number
}

const initialState: TableState = {
  data: null,
  total:0,
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setTableTotal: (state, action: PayloadAction<any>) => {
      state.total = action.payload;
    },
  },
});

export const { setTableData } = tableSlice.actions;

export default tableSlice.reducer;
