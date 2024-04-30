import { fetchGeojsonByCategoryId } from "../../api/api";
import { round } from "lodash";
import { setTableSummationPieData } from "../../reducers/MapView";
import * as turf from "@turf/turf";

function fetchPieSummationReducer(data, client_id, project_id, dispatch) {
  if (data.length > 0) {
    const data_copy = JSON.stringify(
      data.filter((item) => item.type_of_geometry === "Polygon")
    );
    const new_data = JSON.parse(data_copy);
    // console.log(new_data, "existing data pie chart");
    const newDataPromises = new_data.map(async (item) => {
      return fetchGeojsonByCategoryId({
        client_id,
        category_id: item.id,
        project_id,
        type_of_geometry: item.type_of_geometry,
      }).then((res) => {
        const area = turf.area(res);
        const newItem = { ...item, value: round(area, 2) };
        return newItem;
      });
    });
    Promise.all(newDataPromises).then((finalArray) => {
      // const filteredArray = finalArray.filter((item) => item.value !== 0);
      dispatch(setTableSummationPieData(finalArray));
    });
  }
}

export default fetchPieSummationReducer;
