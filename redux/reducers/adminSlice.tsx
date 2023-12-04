import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AdminState {
  labCount: number | null;
  imageCount: number | null;
  labList: ILabList[] | null;
  imageList: ILabImage[] | null;
}

const initialState: AdminState = {
  labCount: 0,
  imageCount: 0,
  labList: null,
  imageList: null,
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
