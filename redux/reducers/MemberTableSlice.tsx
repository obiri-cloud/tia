import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface TableState {
    Memberdata: any;
    MemberPageSize: number;
    MemberOriginalPageSize: number;
}

const initialState: TableState = {
    Memberdata: null,
    MemberPageSize: 0,
    MemberOriginalPageSize: 0,
};

export const MemberTableSlice = createSlice({
  name: "Membertable",
  initialState,
  reducers: {
    setMemberTableData: (state, action: PayloadAction<any>) => {
      state.Memberdata = action.payload;
    },
    setMemberPageSize: (state, action: PayloadAction<number>) => {
      state.MemberPageSize = action.payload;
    },
    setMemberOriginalPageSize: (state, action: PayloadAction<number>) => {
      state.MemberOriginalPageSize = action.payload;
    },
  },
});

export const { setMemberTableData, setMemberPageSize, setMemberOriginalPageSize } = MemberTableSlice.actions;

export default MemberTableSlice.reducer;
