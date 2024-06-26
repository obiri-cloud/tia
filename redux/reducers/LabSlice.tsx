import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TableState {
    LabData: any;
    LabPageSize: number;
    LabOriginalPageSize: number;
}

const initialState: TableState = {
    LabData: null,
    LabPageSize: 0,
    LabOriginalPageSize: 0,
};

export const LabTableSlice = createSlice({
  name: "SliceTable",
  initialState,
  reducers: {
    setLabTableData: (state, action: PayloadAction<any>) => {
      state.LabData = action.payload;
    },
    setLabPageSize: (state, action: PayloadAction<number>) => {
      state.LabPageSize = action.payload;
    },
    setLabOriginalPageSize: (state, action: PayloadAction<number>) => {
      state.LabPageSize = action.payload;
    },
  },
});

export const { setLabTableData, setLabPageSize, setLabOriginalPageSize } = LabTableSlice.actions;

export default LabTableSlice.reducer;
