import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toggleShowGeomFormPopup } from "../../reducers/DisplaySettings";
import AutoCompleteMap from "../AutoCompleteMap/AutoCompleteMap";
import PropTypes from "prop-types";
import { setWKTGeometry } from "../../reducers/DrawnPolygon";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategoryGeomForm({ project_id }) {
  const dispatch = useDispatch();
  const isFormOpen = useSelector(
    (state) => state.displaySettings.showGeomFormPopup
  );
  const wkt_geometry = useSelector((state) => state.drawnPolygon.wkt_geometry);
  const [openCategoryStyleErrorToast, setOpenCategoryStyleErrorToast] =
    useState(false);
  const [openCategoryStyleSuccessToast, setOpenCategoryStyleSuccessToast] =
    useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleCreateCategoryStyle = (event) => {
    event.preventDefault();

    if (selectedCategoryId !== null) {
      if (selectedCategoryId) {
        axios
          .get(
            `${
              import.meta.env.VITE_API_DASHBOARD_URL
            }/category/${selectedCategoryId}/`
          )
          .then((res) => {
            const data = {
              project: parseInt(project_id),
              standard_category: res.data.standard_category,
              sub_category: res.data.sub_category,
              category: selectedCategoryId, // Use the selected category ID
              geom: wkt_geometry,
            };

            axios
              .post(
                `${import.meta.env.VITE_API_DASHBOARD_URL}/polygon-data/`,
                data
              )
              .then(() => {
                setOpenCategoryStyleSuccessToast(true);
                setOpenCategoryStyleErrorToast(false);
                setTimeout(() => {
                  setOpenCategoryStyleSuccessToast(false);
                  closeForm();
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                  }
                }, 3000);
              })
              .catch(() => {
                setOpenCategoryStyleErrorToast(true);
                setOpenCategoryStyleSuccessToast(false);
                setTimeout(() => {
                  setOpenCategoryStyleErrorToast(false);
                  closeForm();
                  if (window.map_global) {
                    const drawInstance = window.map_global.draw;
                    drawInstance.deleteAll();
                    drawInstance.changeMode("simple_select");
                    dispatch(setWKTGeometry(null));
                  }
                }, 3000);
              });
          });
      }
    }
  };

  const closeForm = () => {
    dispatch(toggleShowGeomFormPopup("none"));
  };

  return (
    <div style={{ display: isFormOpen }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategoryStyleErrorToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Failed to Create CategoryStyle"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to Create CategoryStyle
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openCategoryStyleSuccessToast}
        autoHideDuration={6000}
        // onClose={handleClose}
        message="Sucessfully Created CategoryStyle"
        // action={action}
      >
        <Alert
          //  onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Sucessfully Created CategoryStyle
        </Alert>
      </Snackbar>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)", // Semi-transparent backdrop
          zIndex: 9999, // Higher z-index to cover other elements
        }}
      >
        <form
          onSubmit={handleCreateCategoryStyle}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px", // Adjust the width to your desired size
            background: "#fff",
            padding: "20px",
            zIndex: 10000, // Higher z-index for the form
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <AutoCompleteMap
                onItemSelected={(id) => setSelectedCategoryId(id)}
                category={"category"}
                project_id={project_id}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="small"
                fullWidth // Use fullWidth to make the button occupy the form's width
              >
                Done
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={closeForm}
                variant="contained"
                color="error"
                size="small"
                fullWidth // Use fullWidth to make the button occupy the form's width
              >
                Close
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </div>
  );
}
CategoryGeomForm.propTypes = {
  project_id: PropTypes.string,
};
