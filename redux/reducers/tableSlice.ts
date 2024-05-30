import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TableState {
  data: any;
}

const initialState: TableState = {
  data: null,
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { setTableData } = tableSlice.actions;

export default tableSlice.reducer;
