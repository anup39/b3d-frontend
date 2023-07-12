import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
  },
});
