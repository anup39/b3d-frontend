import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
import Project from "./reducers/Project";
import StandardCategory from "./reducers/StandardCategory";
import SubCategory from "./reducers/SubCategory";
import Category from "./reducers/Category";

export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
    project: Project,
    standardCategory: StandardCategory,
    subCategory: SubCategory,
    category: Category,
  },
});
