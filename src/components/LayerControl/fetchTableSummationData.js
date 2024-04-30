import {
  fetchGeojsonByCategoryId,
  fetchMeasuringTableSummation,
} from "../../api/api";
import { round } from "lodash";
import { setTableSummationData } from "../../reducers/MapView";
import * as turf from "@turf/turf";

function fetchTableSummationData(client_id, project_id, dispatch) {
  fetchMeasuringTableSummation({ client_id, project_id }).then((res) => {
    if (res.rows.length > 0) {
      const data_copy = JSON.stringify(
        res.rows
        // res.rows.filter(
        //   (item) =>
        //     item.type_of_geometry === "Polygon" ||
        //     item.type_of_geometry === "LineString" ||
        //     item.type_of_geometry === "Point"
        // )
      );
      const new_data = JSON.parse(data_copy);
      console.log(new_data, "new_data");
      const newDataPromises = new_data.map(async (item) => {
        const geometryType = item.type_of_geometry;
        let newItem;

        return fetchGeojsonByCategoryId({
          client_id,
          category_id: item.id,
          project_id,
          type_of_geometry: item.type_of_geometry,
        }).then((res) => {
          console.log(res);

          if (geometryType === "Polygon") {
            const area = turf.area(res);
            newItem = {
              ...item,
              value: round(area, 2),
              length: "-",
              count: "-",
              trimmed: `${item.view_name.split("|")[1]},${
                item.view_name.split("|")[2]
              }`,
            };
          } else if (geometryType === "LineString") {
            const length = turf.length(res) * 1000;
            newItem = {
              ...item,
              length: round(length, 2),
              value: "-",
              count: "-",
              trimmed: `${item.view_name.split("|")[1]},${
                item.view_name.split("|")[2]
              }`,
            };
          } else {
            console.log(res, "point geojson");
            const numberOfFeatures = res.features.length;
            newItem = {
              ...item,
              count: numberOfFeatures,
              value: "-",
              length: "-",
              trimmed: `${item.view_name.split("|")[1]},${
                item.view_name.split("|")[2]
              }`,
            };
          }

          return newItem;
        });
      });
      Promise.all(newDataPromises).then((finalArray) => {
        // const filteredArray = finalArray.filter((item) => item.value !== 0);
        dispatch(setTableSummationData(finalArray));
      });
    } else {
      dispatch(setTableSummationData([]));
    }
  });
}

export default fetchTableSummationData;
