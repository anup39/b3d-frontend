import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
import Project from "./reducers/Project";
export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
    project: Project,
  },
});
