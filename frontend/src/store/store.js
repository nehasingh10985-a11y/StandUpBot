import { configureStore } from "@reduxjs/toolkit";
import standupReducer from "./slices/standupSlice";
import weeklyReducer from "./slices/weeklySlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    standup: standupReducer,
    weekly: weeklyReducer,
    auth: authReducer,
  },
});

export default store;
