import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
import Project from "./reducers/Project";
import StandardCategory from "./reducers/StandardCategory";
import SubCategory from "./reducers/SubCategory";
import Category from "./reducers/Category";
import CategoryStyle from "./reducers/CategoryStyle";
import MapCategories from "./reducers/MapCategories";
import DrawnPolygon from "./reducers/DrawnPolygon";
import Raster from "./reducers/Raster";
import Users from "./reducers/Users";

export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
    project: Project,
    raster: Raster,
    standardCategory: StandardCategory,
    subCategory: SubCategory,
    category: Category,
    categoryStyle: CategoryStyle,
    mapCategories: MapCategories,
    drawnPolygon: DrawnPolygon,
    users: Users,
  },
});
