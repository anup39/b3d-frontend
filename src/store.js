import { configureStore } from '@reduxjs/toolkit';
import DisplaySettings from './reducers/DisplaySettings';
import Auth from './reducers/Auth';
import Client from './reducers/Client';
import Project from './reducers/Project';
import StandardCategory from './reducers/StandardCategory';
import SubCategory from './reducers/SubCategory';
import Category from './reducers/Category';
import MapCategories from './reducers/MapCategories';
import DrawnPolygon from './reducers/DrawnGeometry';
import Users from './reducers/Users';
import Property from './reducers/Property';
import MapView from './reducers/MapView';
import UploadMeasuring from './reducers/UploadMeasuring';
import InspectionUpload from './reducers/InspectionUpload';
import Inspection from './reducers/Inspection';

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
    inspectionUpload: InspectionUpload,
    uploadMeasuring: UploadMeasuring,
    inspection: Inspection,
  },
});
