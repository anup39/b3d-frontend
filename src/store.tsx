import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
import Client from "./reducers/Client";
import Project from "./reducers/Project";
import StandardCategory from "./reducers/StandardCategory";
import SubCategory from "./reducers/SubCategory";
import Category from "./reducers/Category";
import MapCategories from "./reducers/MapCategories";
import DrawnPolygon from "./reducers/DrawnGeometry";
import Users from "./reducers/Users";
import Property from "./reducers/Property";
import MapView from "./reducers/MapView";
import UploadMeasuring from "./reducers/UploadMeasuring";
import InspectionUpload from "./reducers/InspectionUpload";
import Inspection from "./reducers/Inspection";
import InspectionFlow from "./reducers/InspectionFlow";
import StandardInspection from "./reducers/StandardInspection";
import SubInspection from "./reducers/SubInspection";
import Inspections from "./reducers/Inspections";

export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
    client: Client,
    project: Project,
    property: Property,
    standardCategory: StandardCategory,
    subCategory: SubCategory,
    category: Category,
    mapCategories: MapCategories,
    drawnPolygon: DrawnPolygon,
    users: Users,
    mapView: MapView,
    uploadMeasuring: UploadMeasuring,
    inspection: Inspection,
    inspectionUpload: InspectionUpload,
    inspectionFlow: InspectionFlow,
    standardInspection: StandardInspection,
    subInspection: SubInspection,
    inspections: Inspections,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
