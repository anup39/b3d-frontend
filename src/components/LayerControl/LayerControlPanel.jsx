import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { PropTypes } from "prop-types";
import AddLayerAndSourceToMap from "../../maputils/AddLayerAndSourceToMap";

const all_categories = [
  {
    id: 1,
    label: "Grass",
    checked: false,
    expand: false,
    indeterminate: false,
    extent: [],
    sub_category: [
      {
        id: 1,
        label: "Green",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Green", checked: false, extent: [] },
          { id: 2, label: "Short Green", checked: false, extent: [] },
        ],
      },
      {
        id: 2,
        label: "Light Green",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Light", checked: false, extent: [] },
          { id: 2, label: "Short Light", checked: false, extent: [] },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Trees",
    checked: false,
    expand: false,
    indeterminate: false,
    extent: [],
    sub_category: [
      {
        id: 1,
        label: "Tropical",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Tropical", checked: false, extent: [] },
          { id: 2, label: "Short Tropical", checked: false, extent: [] },
        ],
      },
      {
        id: 2,
        label: "Terrestrial",
        checked: false,
        expand: false,
        indeterminate: false,
        extent: [],
        category: [
          { id: 1, label: "Tall Terrestrial", checked: false, extent: [] },
          { id: 2, label: "Short Terrestrial", checked: false, extent: [] },
        ],
      },
    ],
  },
  {
    id: 3,
    label: "Land",
    checked: false,
    expand: false,
    indeterminate: false,
    extent: [],
    sub_category: [],
  },
];

export default function LayersControlPanel({ map }) {
  const [categories, setCategories] = useState(all_categories);
  const client_id = useSelector((state) => state.mapCategories.client_id);

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/map-measurings/?client=${client_id}`
      )
      .then((res) => {
        setCategories(res.data);
      });
  }, [client_id]);

  const handleChangesd = (event, sdIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].checked = event.target.checked;
    updatedCategories[sdIndex].indeterminate = false;
    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      sub.checked = event.target.checked;
      sub.indeterminate = false;
      sub.category.forEach((cat) => {
        cat.checked = event.target.checked;
        if (cat.type_of_geometry) {
          const sourceId = String(client_id) + cat.view_name + "source";
          const layerId = String(client_id) + cat.view_name + "layer";
          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-style/?category=${cat.id}`
            )
            .then((response) => {
              const categoryStyle = response.data[0];
              AddLayerAndSourceToMap({
                map: map,
                layerId: layerId,
                sourceId: sourceId,
                url: `${
                  import.meta.env.VITE_API_MAP_URL
                }/function_zxy_query_app_polygondata_by_category/{z}/{x}/{y}?category=${
                  cat.id
                }`,
                source_layer: "function_zxy_query_app_polygondata_by_category",
                showPopup: true,
                style: {
                  fill_color: categoryStyle.fill,
                  fill_opacity: categoryStyle.fill_opacity,
                  stroke_color: categoryStyle.stroke,
                },
                zoomToLayer: false,
                extent: [],
                fillType: "fill",
                trace: false,
                component: "map",
              });
            });
        }
      });
    });
    setCategories(updatedCategories);
  };

  // TODO: Here small issue , when the categories are empty for sub category , in this case when i selected any catgroy it will be automatically checked
  const handleChangesub = (event, sdIndex, subIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].sub_category[subIndex].checked =
      event.target.checked;
    updatedCategories[sdIndex].sub_category[subIndex].indeterminate = false;

    updatedCategories[sdIndex].sub_category[subIndex].category.forEach(
      (cat) => {
        cat.checked = event.target.checked;
        console.log(cat, "category clicked in sub");
        if (cat.type_of_geometry) {
          const sourceId = String(client_id) + cat.view_name + "source";
          const layerId = String(client_id) + cat.view_name + "layer";
          const url = `${
            import.meta.env.VITE_API_MAP_URL
          }/function_zxy_query_app_polygondata_by_category/{z}/{x}/{y}?category=${
            cat.id
          }`;
          const source_layer = "function_zxy_query_app_polygondata_by_category";
          const newSource = {
            type: "vector",
            tiles: [url],
            // promoteId: "id",
          };

          axios
            .get(
              `${
                import.meta.env.VITE_API_DASHBOARD_URL
              }/category-style/?category=${cat.id}`
            )
            .then((response) => {
              const categoryStyle = response.data[0];
              map.addSource(sourceId, newSource);

              const newLayer = {
                id: layerId,
                type: "fill",
                source: sourceId,
                "source-layer": source_layer,
                layout: {},
                paint: {
                  "fill-color": categoryStyle.fill,
                  "fill-outline-color": categoryStyle.stroke,
                  "fill-opacity": parseFloat(categoryStyle.fill_opacity),
                },
              };
              map.addLayer(newLayer);
              map.moveLayer(layerId, "gl-draw-polygon-fill-inactive.cold");
            });
        }
      }
    );

    let allSubCategoriesChecked = true;
    let someSubCategoriesChecked = false;

    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      if (!sub.checked) {
        allSubCategoriesChecked = false;
      } else {
        someSubCategoriesChecked = true;
      }
    });

    updatedCategories[sdIndex].checked = allSubCategoriesChecked;
    updatedCategories[sdIndex].indeterminate =
      someSubCategoriesChecked && !allSubCategoriesChecked;

    // Check if all sub-categories are checked, then check the main category
    if (allSubCategoriesChecked) {
      updatedCategories[sdIndex].checked = true;
      updatedCategories[sdIndex].indeterminate = false;
    }

    setCategories(updatedCategories);
  };

  const handleChangecat = (event, sdIndex, subIndex, catIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].sub_category[subIndex].category[
      catIndex
    ].checked = event.target.checked;
    let allCategoriesChecked = true;
    let someCategoriesChecked = false;

    updatedCategories[sdIndex].sub_category[subIndex].category.forEach(
      (cat) => {
        if (!cat.checked) {
          allCategoriesChecked = false;
        } else {
          someCategoriesChecked = true;
        }
      }
    );

    updatedCategories[sdIndex].sub_category[subIndex].checked =
      allCategoriesChecked;
    updatedCategories[sdIndex].sub_category[subIndex].indeterminate =
      someCategoriesChecked && !allCategoriesChecked;

    let someSubCategoriesChecked = false;

    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      let allSubCategoriesCheckedForSub = true;

      sub.category.forEach((cat) => {
        if (!cat.checked) {
          allSubCategoriesCheckedForSub = false;
        }
      });

      if (allSubCategoriesCheckedForSub) {
        sub.checked = true;
        sub.indeterminate = false;
      } else {
        sub.checked = false;
        someSubCategoriesChecked = true;
      }
    });

    updatedCategories[sdIndex].checked = !someSubCategoriesChecked;
    updatedCategories[sdIndex].indeterminate = someSubCategoriesChecked;

    // Check if none of the categories within a sub-category are checked
    let noCategoriesChecked = true;
    updatedCategories[sdIndex].sub_category.forEach((sub) => {
      sub.category.forEach((cat) => {
        if (cat.checked) {
          noCategoriesChecked = false;
        }
      });
    });

    if (noCategoriesChecked) {
      updatedCategories[sdIndex].checked = false;
      updatedCategories[sdIndex].indeterminate = false;
    }

    setCategories(updatedCategories);
  };

  const handleChangeExpandSd = (event, sdIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].expand = !updatedCategories[sdIndex].expand;

    setCategories(updatedCategories);
  };

  const handleChangeExpandSub = (event, sdIndex, subIndex) => {
    const updatedCategories = [...categories];
    updatedCategories[sdIndex].sub_category[subIndex].expand =
      !updatedCategories[sdIndex].sub_category[subIndex].expand;
    setCategories(updatedCategories);
  };

  return (
    <div style={{ maxHeight: "50vh", minWidth: "12vw" }}>
      {categories.map((sd, sdIndex) => (
        <div key={sd.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ExpandMoreIcon
                sx={{
                  transform: sd.expand ? "rotate(360deg)" : "rotate(-90deg)",
                  fontSize: "14px",
                  backgroundColor: "#FFFFFF",
                  color: "black",
                  marginRight: "4px",
                  padding: "2px",
                  "&:hover": {
                    backgroundColor: "#9C27B0",
                  },
                }}
                onClick={(event) => handleChangeExpandSd(event, sdIndex)}
              />
              <FormControlLabel
                label={sd.label}
                control={
                  <Checkbox
                    size="medium"
                    checked={sd.checked}
                    indeterminate={sd.indeterminate}
                    onChange={(event) => handleChangesd(event, sdIndex)}
                  />
                }
              />
            </Box>
            <ZoomInIcon
              sx={{
                backgroundColor: "#F1F7FF",
                color: "black",
                "&:hover": { cursor: "pointer" },
              }}
            />
          </Box>

          {sd.sub_category.map((sub, subIndex) => (
            <Box
              sx={{
                display: sd.expand ? "flex" : "none",
                flexDirection: "column",
                ml: 3,
              }}
              key={sub.id}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ExpandMoreIcon
                  sx={{
                    transform: sub.expand ? "rotate(360deg)" : "rotate(-90deg)",
                    fontSize: "14px",
                    backgroundColor: "#FFFFFF",
                    color: "black",
                    marginRight: "4px",
                    padding: "2px",
                    "&:hover": {
                      backgroundColor: "#9C27B0",
                    },
                  }}
                  onClick={(event) =>
                    handleChangeExpandSub(event, sdIndex, subIndex)
                  }
                />
                <FormControlLabel
                  label={sub.label}
                  control={
                    <Checkbox
                      checked={sub.checked}
                      indeterminate={sub.indeterminate}
                      onChange={(event) =>
                        handleChangesub(event, sdIndex, subIndex)
                      }
                    />
                  }
                />
                <ZoomInIcon
                  sx={{
                    backgroundColor: "#F1F7FF",
                    color: "black",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
              </Box>

              {sub.category.map((cat, catIndex) => (
                <Box
                  sx={{
                    display: sub.expand ? "flex" : "none",
                    flexDirection: "column",
                    ml: 5,
                  }}
                  key={cat.id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      label={cat.label}
                      control={
                        <Checkbox
                          checked={cat.checked}
                          onChange={(event) =>
                            handleChangecat(event, sdIndex, subIndex, catIndex)
                          }
                        />
                      }
                    />
                    <ZoomInIcon
                      sx={{
                        marginLeft: "10px",
                        backgroundColor: "#F1F7FF",
                        color: "black",
                        "&:hover": { cursor: "pointer" },
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </div>
      ))}
    </div>
  );
}

LayersControlPanel.propTypes = {
  map: PropTypes.object,
};
