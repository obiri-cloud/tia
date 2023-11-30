import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  labCount: number;
  imageCount: number;
  labList: ILabList[];
  imageList: ILabImage[];
}

const initialState: AdminState = {
  labCount: 0,
  imageCount: 0,
  labList: [],
  imageList: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLabCount: (state, action: PayloadAction<number>) => {
      state.labCount = action.payload;
    },
    setImageCount: (state, action: PayloadAction<number>) => {
      state.imageCount = action.payload;
    },
    setLabList: (state, action: PayloadAction<ILabList[]>) => {
      state.labList = action.payload;
    },
    setImageList: (state, action: PayloadAction<ILabImage[]>) => {
      state.imageList = action.payload;
    },
  },
});

export const { setLabCount, setImageCount, setLabList, setImageList } =
  adminSlice.actions;

export default adminSlice.reducer;
