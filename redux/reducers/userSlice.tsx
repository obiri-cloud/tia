import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  labList: ILabList[] | null;
  imageList: ILabImage[] | null;
  currentImage: ILabImage | null;
}

const initialState: UserState = {
  labList: null,
  imageList: null,
  currentImage: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLabList: (state, action: PayloadAction<ILabList[]>) => {
      state.labList = action.payload;
    },
    setImageList: (state, action: PayloadAction<ILabImage[]>) => {
      state.imageList = action.payload;
    },
    setCurrentImage: (state, action: PayloadAction<ILabImage>) => {
      state.currentImage = action.payload;
    },
  },
});

export const { setLabList, setImageList, setCurrentImage } = userSlice.actions;

export default userSlice.reducer;
