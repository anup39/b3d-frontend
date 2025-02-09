import { configureStore } from "@reduxjs/toolkit";
import DisplaySettings from "./reducers/DisplaySettings";
import Auth from "./reducers/Auth";
import Client from "./reducers/Client";
import Project from "./reducers/Project";
import Tifs from "./reducers/Tifs";
import StandardCategory from "./reducers/StandardCategory";
import SubCategory from "./reducers/SubCategory";
import Category from "./reducers/Category";
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
import EditClassification from "./reducers/EditClassification";
import { projectApi } from "./api/projectApi";
import { clientApi } from "./api/clientApi";
import { measuringFileUploadApi } from "./api/measuringFileUpload";
import { setupListeners } from "@reduxjs/toolkit/query";
import { indoorApi } from "./api/indoorApi";
import { rasterDataApi } from "./api/rasterDataApi";
import { rolesApi } from "./api/rolesApi";
import { globalCategoryApi } from "./api/globalCategoryApi";
import { globalCategoryStyleApi } from "./api/globalCategoryStyleApi";
import { globalSubCategoryApi } from "./api/globalSubCategoryAPi";
import { categoryApi } from "./api/categoryApi";
import { updateExtraFieldsApi } from "./api/updateExtraFieldsApi";
import { polygonDataApi } from "./api/polygonDataApi";
import { globalStandardCategoryApi } from "./api/globalStandardCategoryApi";

export const store = configureStore({
  reducer: {
    displaySettings: DisplaySettings,
    auth: Auth,
    client: Client,
    project: Project,
    tifs: Tifs,
    property: Property,
    standardCategory: StandardCategory,
    subCategory: SubCategory,
    category: Category,
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
    editClassification: EditClassification,
    [projectApi.reducerPath]: projectApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [measuringFileUploadApi.reducerPath]: measuringFileUploadApi.reducer,
    [indoorApi.reducerPath]: indoorApi.reducer,
    [rolesApi.reducerPath]: rolesApi.reducer,
    [rasterDataApi.reducerPath]: rasterDataApi.reducer,
    [globalCategoryApi.reducerPath]: globalCategoryApi.reducer,
    [globalCategoryStyleApi.reducerPath]: globalCategoryStyleApi.reducer,
    [globalSubCategoryApi.reducerPath]: globalSubCategoryApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [updateExtraFieldsApi.reducerPath]: updateExtraFieldsApi.reducer,
    [polygonDataApi.reducerPath]: polygonDataApi.reducer,
    [globalStandardCategoryApi.reducerPath]: globalStandardCategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      projectApi.middleware as any,
      clientApi.middleware as any,
      measuringFileUploadApi.middleware as any,
      indoorApi.middleware as any,
      rolesApi.middleware as any,
      rasterDataApi.middleware as any,
      globalCategoryApi.middleware as any,
      globalCategoryStyleApi.middleware as any,
      globalSubCategoryApi.middleware as any,
      polygonDataApi.middleware as any,
      categoryApi.middleware as any,
      updateExtraFieldsApi.middleware as any,
      globalStandardCategoryApi.middleware as any
    ),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
