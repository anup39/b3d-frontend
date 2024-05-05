import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import TabIcon from "@mui/icons-material/Tab";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import {
  setCategoryEditData,
  setOpenCategoryEditForm,
} from "../../reducers/EditClassification";
import { useDispatch } from "react-redux";

export default function CategoryCard({
  id,
  name,
  full_name,
  description,
  type_of_geometry,
  sub_category,
  standard_category,
}) {
  const dispatch = useDispatch();
  const [style, setStyle] = useState();
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_DASHBOARD_URL
        }/global-category-style/?category=${id}`
      )
      .then((res) => {
        const style = res.data[0];
        console.log(style, "style");
        setStyle(style);
      });
  }, [id]);

  return (
    <Paper
      sx={{
        p: 1,
        margin: 1,
        // maxWidth: 500,
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#1A2027" : "#fff",
      }}
    >
      <Grid container spacing={2}>
        <Grid item>
          <TabIcon sx={{ width: 30, height: 30, color: "green" }} />
        </Grid>
        <Grid item xs={12} sm container>
          <Grid
            item
            xs
            container
            direction="row"
            alignItems={"center"}
            spacing={2}
          >
            <Grid item xs>
              <Typography gutterBottom variant="subtitle1" component="div">
                <b>{full_name}</b>
              </Typography>
              <Typography variant="body2" gutterBottom>
                {description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Type of Geometry: {type_of_geometry}
              </Typography>
              {style ? (
                <>
                  <Typography variant="body2" gutterBottom>
                    <span>Fill Color: </span>
                    <span
                      style={{
                        color: style.fill,
                        backgroundColor: style.fill,
                      }}
                    >
                      {style.fill}
                    </span>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <span>Fill Opacity: </span>

                    {style.fill_opacity}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <span>Stroke Color: </span>
                    <span
                      style={{
                        color: style.stroke,
                        backgroundColor: style.stroke,
                      }}
                    >
                      {style.stroke}
                    </span>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <span>Stroke Width: </span>
                    {style.stroke_width}
                  </Typography>
                </>
              ) : null}
            </Grid>
            <Grid>
              <Typography variant="body2" style={{ cursor: "pointer" }}>
                <Button
                  onClick={() => {
                    dispatch(setOpenCategoryEditForm(true));
                    dispatch(
                      setCategoryEditData({
                        id,
                        name,
                        type_of_geometry,
                        style,
                        full_name,
                        description,
                        sub_category,
                        standard_category: standard_category,
                      })
                    );
                  }}
                  variant="contained"
                >
                  Edit
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

CategoryCard.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  full_name: PropTypes.string,
  description: PropTypes.string,
  type_of_geometry: PropTypes.string,
  created_at: PropTypes.string,
  sub_category: PropTypes.number,
  standard_category: PropTypes.number,
};
