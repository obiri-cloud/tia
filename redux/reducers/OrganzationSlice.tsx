import { ILabImage, ILabList } from "@/app/types";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface OrgState {
  id: string | null;
  name: string | null;
  owner: {
     first_name:string | null,
     last_name:string | null,
     username:string | null
  };
}

const initialState: OrgState = {
  id:null,
  name:null,
  owner:{
    first_name:null,
    last_name:null,
    username:null
  },
};

export const OrganizationSlice = createSlice({
  name: "orgOwner",
  initialState,
  reducers: {
    setOrgData: (state, action: PayloadAction<OrgState>) => {
      console.log("action.payload",action.payload);
      state = action.payload;
    }
  },
});

export const { setOrgData } = OrganizationSlice.actions;

export default OrganizationSlice.reducer;
