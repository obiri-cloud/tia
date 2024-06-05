import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TableState {
  data: any;
  pageSize: number;
  originalPageSize: number;
}

const initialState: TableState = {
  data: null,
  pageSize: 0,
  originalPageSize: 0,
};

export const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setTableData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setOriginalPageSize: (state, action: PayloadAction<number>) => {
      state.originalPageSize = action.payload;
    },
  },
});

export const { setTableData, setPageSize, setOriginalPageSize } = tableSlice.actions;

export default tableSlice.reducer;
