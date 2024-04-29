import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./reducers/adminSlice";
import userReducer from "./reducers/userSlice";
import organizationReducer from './reducers/OrganzationSlice'
export const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    orgOwner:organizationReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
