import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./reducers/adminSlice";
import userReducer from "./reducers/userSlice";
// import organizationReducer from './reducers/OrganzationSlice'
import tableReducer from './reducers/tableSlice'
import dialogStateReducer from './reducers/dialogSlice'
import nextStateSlice from './reducers/nextPaginationSlice'
import MemberTableReducer from "./reducers/MemberTableSlice";
import LabTableReducer from './reducers/LabSlice'


import organizationReducer from './reducers/OrganizationSlice' 
export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    orgOwner:organizationReducer,
    table: tableReducer,
    dialogBtn: dialogStateReducer,
    nextbtn: nextStateSlice,
    memberTable:MemberTableReducer,
    LabTable:LabTableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
